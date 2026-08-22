import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabase, getSupabaseAuth } from "@/lib/supabase/server";
import { pbkdf2, secretsMatch, timingSafeEqual } from "./crypto.server";
import { consumeRateLimit } from "./rate-limit.server";
import {
  clientIp,
  destroyAuthSession,
  isSessionConfigured,
  issueAuthSession,
  readAuthSession,
  type AuthSessionData,
} from "./session.server";

const INVALID = "That email or password didn’t match. Try again.";
const LOCKED = "Too many sign-in attempts. Try again in a few minutes.";
const RESET_OK = "If an account exists, an administrator or reset email will follow up.";

const BUILTIN_ACCOUNT = {
  username: "optigo",
  email: "optigo@optigo.app",
  displayName: "LensFlow",
  passwordSalt: "0490868e0e6d407ba553f3114f3faa5e",
  passwordHash: "e76e2849c6aa5c537c07cdb4b9086a4066bfd19490e368b5f9252f2e787dc695",
};

const loginSchema = z.object({
  identifier: z.string().trim().min(1).max(120),
  password: z.string().min(1).max(128),
});

const resetSchema = z.object({
  identifier: z.string().trim().min(1).max(120),
});

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function siteUrl() {
  return process.env["PUBLIC_SITE_URL"] || process.env["SITE_URL"] || "https://optigo.app";
}

async function runDummyWork(salt: string) {
  await secretsMatch("optigo-dummy-candidate", "optigo-dummy-expected", salt);
}

function fromHex(hex: string) {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function verifyWorkspaceAccount(identifier: string, password: string) {
  const supabase = getSupabase();
  const dummySalt = process.env["SESSION_SECRET"] || "optigo-auth-salt";
  if (!supabase) {
    await runDummyWork(dummySalt);
    return null;
  }

  const id = identifier.trim().toLowerCase();
  const byUsername = await supabase
    .from("workspace_accounts")
    .select("username, display_name, password_salt, password_hash")
    .eq("username", id)
    .maybeSingle();

  const row =
    byUsername.data ??
    (isEmail(id)
      ? (
          await supabase
            .from("workspace_accounts")
            .select("username, display_name, password_salt, password_hash")
            .eq("email", id)
            .maybeSingle()
        ).data
      : null);

  if (!row) {
    await runDummyWork(dummySalt);
    return null;
  }

  const expected = fromHex(row.password_hash);
  if (!expected) {
    await runDummyWork(dummySalt);
    return null;
  }

  const derived = await pbkdf2(password, row.password_salt);
  if (!timingSafeEqual(derived, expected)) return null;

  return {
    userId: `workspace:${row.username}`,
    displayName: row.display_name,
  } satisfies AuthSessionData;
}

async function verifyBuiltinAccount(identifier: string, password: string) {
  const id = identifier.trim().toLowerCase();
  const userOk = id === BUILTIN_ACCOUNT.username || id === BUILTIN_ACCOUNT.email;
  const expected = fromHex(BUILTIN_ACCOUNT.passwordHash);
  if (!expected) return null;
  const derived = await pbkdf2(password, BUILTIN_ACCOUNT.passwordSalt);
  if (!userOk || !timingSafeEqual(derived, expected)) return null;
  return {
    userId: `workspace:${BUILTIN_ACCOUNT.username}`,
    displayName: BUILTIN_ACCOUNT.displayName,
  } satisfies AuthSessionData;
}

async function verifyEnvCredentials(identifier: string, password: string) {
  const username = (process.env["AUTH_USERNAME"] || "").trim().toLowerCase();
  const expectedPassword = process.env["AUTH_PASSWORD"] || "";
  const salt = process.env["SESSION_SECRET"] || "optigo-auth-salt";
  if (!username || !expectedPassword) {
    await runDummyWork(salt);
    return null;
  }
  const id = identifier.trim().toLowerCase();
  const userOk = id === username || (isEmail(id) && id === (process.env["AUTH_EMAIL"] || "").trim().toLowerCase());
  const passOk = await secretsMatch(password, expectedPassword, salt);
  if (!userOk || !passOk) return null;
  return {
    userId: `local:${username}`,
    displayName: process.env["AUTH_DISPLAY_NAME"]?.trim() || username,
  } satisfies AuthSessionData;
}

async function verifySupabaseCredentials(identifier: string, password: string) {
  const auth = getSupabaseAuth();
  const salt = process.env["SESSION_SECRET"] || "optigo-auth-salt";
  if (!auth) {
    await runDummyWork(salt);
    return null;
  }

  const id = identifier.trim();
  const mappedEmail = (process.env["AUTH_EMAIL"] || "optigo@optigo.app").trim();
  const mappedUser = (process.env["AUTH_USERNAME"] || "optigo").trim().toLowerCase();
  const email = isEmail(id)
    ? id
    : mappedEmail && id.toLowerCase() === mappedUser
      ? mappedEmail
      : "";

  if (!email) {
    await runDummyWork(salt);
    return null;
  }

  const { data, error } = await auth.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    await runDummyWork(salt);
    return null;
  }

  const meta = data.user.user_metadata as Record<string, unknown>;
  const fromMeta = typeof meta["full_name"] === "string" ? meta["full_name"] : "";
  const displayName =
    fromMeta.trim() ||
    data.user.email?.split("@")[0] ||
    "LensFlow";

  return {
    userId: data.user.id,
    displayName,
  } satisfies AuthSessionData;
}

export const getAuthSession = createServerFn({ method: "GET" }).handler(async () => {
  return readAuthSession();
});

export const signIn = createServerFn({ method: "POST" })
  .validator((input: unknown) => loginSchema.parse(input))
  .handler(async ({ data }) => {
    if (!isSessionConfigured()) {
      return { ok: false as const, error: "Sign-in is not configured yet." };
    }

    const ip = clientIp();
    const idKey = data.identifier.trim().toLowerCase();
    const ipLimit = consumeRateLimit(`login:ip:${ip}`);
    const idLimit = consumeRateLimit(`login:id:${idKey}`, 8);
    if (!ipLimit.ok || !idLimit.ok) {
      return { ok: false as const, error: LOCKED };
    }

    const viaTable = await verifyWorkspaceAccount(data.identifier, data.password);
    const viaBuiltin = viaTable ?? (await verifyBuiltinAccount(data.identifier, data.password));
    const viaSupabase = viaBuiltin ?? (await verifySupabaseCredentials(data.identifier, data.password));
    const session = viaSupabase ?? (await verifyEnvCredentials(data.identifier, data.password));
    if (!session) {
      return { ok: false as const, error: INVALID };
    }

    await issueAuthSession(session);
    return { ok: true as const };
  });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  await destroyAuthSession();
  return { ok: true as const };
});

export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator((input: unknown) => resetSchema.parse(input))
  .handler(async ({ data }) => {
    const ip = clientIp();
    const limited = consumeRateLimit(`reset:ip:${ip}`, 5, 15 * 60 * 1000);
    if (!limited.ok) return { ok: true as const, message: RESET_OK };

    const auth = getSupabaseAuth();
    const id = data.identifier.trim();
    const mappedEmail = (process.env["AUTH_EMAIL"] || "optigo@optigo.app").trim();
    const mappedUser = (process.env["AUTH_USERNAME"] || "optigo").trim().toLowerCase();
    const email = isEmail(id)
      ? id
      : mappedEmail && id.toLowerCase() === mappedUser
        ? mappedEmail
        : "";

    if (auth && email) {
      await auth.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl().replace(/\/$/, "")}/login`,
      });
    } else {
      await runDummyWork(process.env["SESSION_SECRET"] || "optigo-auth-salt");
    }

    return { ok: true as const, message: RESET_OK };
  });

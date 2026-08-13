import {
  clearSession,
  getRequestIP,
  getRequestProtocol,
  useSession,
} from "@tanstack/react-start/server";

export type AuthSessionData = {
  userId: string;
  displayName: string;
};

const SESSION_NAME = "optigo";
const MAX_AGE = 60 * 60 * 12;
const FALLBACK_SESSION_SECRET = "optigo-http-session-secret-v1-connect-flow-workspace";

function sessionPassword() {
  const explicit = process.env["SESSION_SECRET"];
  if (explicit && explicit.length >= 32) return explicit;
  const service = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (service && service.length >= 32) return service.slice(0, 64);
  return FALLBACK_SESSION_SECRET;
}

function sessionConfig() {
  const password = sessionPassword();
  if (!password) return null;
  return {
    name: SESSION_NAME,
    password,
    maxAge: MAX_AGE,
    cookie: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: getRequestProtocol() === "https",
      path: "/",
    },
  };
}

export async function readAuthSession(): Promise<AuthSessionData | null> {
  const config = sessionConfig();
  if (!config) return null;
  const session = await useSession<AuthSessionData>(config);
  const userId = session.data.userId;
  const displayName = session.data.displayName;
  if (!userId || !displayName) return null;
  return { userId, displayName };
}

export async function issueAuthSession(data: AuthSessionData) {
  const config = sessionConfig();
  if (!config) throw new Error("SESSION_SECRET is not configured.");
  const session = await useSession<AuthSessionData>(config);
  await session.clear();
  await session.update(() => data);
}

export async function destroyAuthSession() {
  const config = sessionConfig();
  if (!config) return;
  await clearSession(config);
}

export function clientIp() {
  return (
    getRequestIP({ xForwardedFor: true }) ||
    getRequestIP() ||
    "unknown"
  );
}

export function isSessionConfigured() {
  return sessionPassword() != null;
}

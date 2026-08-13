import { DEMO_ORG_ID } from "./ids";
import { seedDemoDatabase } from "./seed";
import type { LensConfigDatabase } from "./types";

const memory = new Map<string, LensConfigDatabase>();
const KEY = (organizationId: string) => `optigo.lens-config.v1.${organizationId}`;

function clone<T>(value: T): T {
  return structuredClone(value);
}

function readStorage(organizationId: string): LensConfigDatabase | null {
  if (typeof window === "undefined") return memory.get(organizationId) ?? null;
  try {
    const raw = window.localStorage.getItem(KEY(organizationId));
    if (!raw) return null;
    return JSON.parse(raw) as LensConfigDatabase;
  } catch {
    return null;
  }
}

function writeStorage(organizationId: string, db: LensConfigDatabase): void {
  memory.set(organizationId, clone(db));
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY(organizationId), JSON.stringify(db));
  } catch {
    /* quota / private mode */
  }
}

/** Local cache used while Supabase hydrates, and when Cloud is not configured. */
export function loadDatabase(organizationId: string): LensConfigDatabase {
  const existing = readStorage(organizationId);
  if (existing) {
    memory.set(organizationId, existing);
    return clone(existing);
  }
  const seeded = seedDemoDatabase(organizationId);
  writeStorage(organizationId, seeded);
  return clone(seeded);
}

export function saveDatabase(organizationId: string, db: LensConfigDatabase): void {
  writeStorage(organizationId, db);
}

export function resetDatabase(organizationId = DEMO_ORG_ID): LensConfigDatabase {
  memory.delete(organizationId);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY(organizationId));
    } catch {
      /* ignore */
    }
  }
  return loadDatabase(organizationId);
}

export function databaseFromSeed(organizationId = DEMO_ORG_ID): LensConfigDatabase {
  return seedDemoDatabase(organizationId);
}

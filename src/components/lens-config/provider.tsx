import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { demoActor } from "@/lib/lens-config/permissions";
import { isLensConfigDatabase } from "@/lib/lens-config/guard";
import { fetchLensConfig, persistLensConfig } from "@/lib/lens-config/remote";
import { loadDatabase, saveDatabase } from "@/lib/lens-config/store";
import { DEMO_ORG_ID } from "@/lib/lens-config/ids";
import type { Actor, LensConfigDatabase } from "@/lib/lens-config/types";

export type WorkspaceStorage = "loading" | "cloud" | "local";

type LensConfigContextValue = {
  actor: Actor;
  db: LensConfigDatabase;
  storage: WorkspaceStorage;
  commit: (recipe: (draft: LensConfigDatabase) => void) => void;
  replace: (next: LensConfigDatabase) => void;
};

const LensConfigContext = createContext<LensConfigContextValue | null>(null);

function parseRemotePayload(payload: string | null): LensConfigDatabase | null {
  if (!payload) return null;
  try {
    const parsed: unknown = JSON.parse(payload);
    return isLensConfigDatabase(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function LensConfigProvider({ children }: { children: ReactNode }) {
  const actor = useMemo(() => demoActor(), []);
  const organizationId = actor.organizationId || DEMO_ORG_ID;
  const [db, setDb] = useState(() => loadDatabase(organizationId));
  const [storage, setStorage] = useState<WorkspaceStorage>("loading");
  const saveSeq = useRef(0);

  const persist = useCallback(
    (next: LensConfigDatabase) => {
      saveDatabase(organizationId, next);
      const seq = ++saveSeq.current;
      void persistLensConfig({
        data: {
          organizationId,
          payload: JSON.stringify(next),
          updatedBy: actor.userId,
        },
      }).then((result) => {
        if (seq !== saveSeq.current) return;
        if (result.ok && result.configured) setStorage("cloud");
      });
    },
    [actor.userId, organizationId],
  );

  useEffect(() => {
    let cancelled = false;
    void fetchLensConfig({ data: { organizationId } }).then((result) => {
      if (cancelled) return;
      if (!result.configured || !result.ok) {
        setStorage("local");
        return;
      }
      const remote = parseRemotePayload(result.payload);
      if (remote) {
        saveDatabase(organizationId, remote);
        setDb(remote);
        setStorage("cloud");
        return;
      }
      const seeded = loadDatabase(organizationId);
      setStorage("cloud");
      void persistLensConfig({
        data: {
          organizationId,
          payload: JSON.stringify(seeded),
          updatedBy: actor.userId,
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [actor.userId, organizationId]);

  const replace = useCallback(
    (next: LensConfigDatabase) => {
      persist(next);
      setDb(next);
    },
    [persist],
  );

  const commit = useCallback(
    (recipe: (draft: LensConfigDatabase) => void) => {
      setDb((current) => {
        const draft = structuredClone(current);
        recipe(draft);
        persist(draft);
        return draft;
      });
    },
    [persist],
  );

  const value = useMemo(
    () => ({ actor, db, storage, commit, replace }),
    [actor, db, storage, commit, replace],
  );
  return <LensConfigContext.Provider value={value}>{children}</LensConfigContext.Provider>;
}

export function useLensConfig() {
  const ctx = useContext(LensConfigContext);
  if (!ctx) throw new Error("useLensConfig must be used within LensConfigProvider");
  return ctx;
}

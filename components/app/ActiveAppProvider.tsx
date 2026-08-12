"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

export type AppRow = {
  id: string;
  clientId?: string;
  domain: string;
  name: string;
  role: string;
};

const STORAGE_KEY = "tashrif_active_app_id";

type ActiveAppContextValue = {
  apps: AppRow[];
  activeAppId: string | null;
  activeApp: AppRow | null;
  loading: boolean;
  setActiveAppId: (id: string | null) => void;
  adoptAppIdFromUrl: (urlAppId: string) => void;
  refreshApps: (preferredId?: string | null) => Promise<void>;
};

const ActiveAppContext = createContext<ActiveAppContextValue | null>(null);

function readStoredId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

/** Prefer /app/[appId] from the current URL when resolving after refresh. */
function readUrlAppId(): string | null {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/\/(?:uz|en)\/app\/([^/]+)/);
  if (match?.[1]) return match[1];
  const bare = window.location.pathname.match(/\/app\/([^/]+)/);
  return bare?.[1] ?? null;
}

function writeStoredId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(STORAGE_KEY, id);
  else localStorage.removeItem(STORAGE_KEY);
}

function resolveActiveId(
  apps: AppRow[],
  ...preferred: Array<string | null | undefined>
): string | null {
  if (apps.length === 0) return null;
  for (const id of preferred) {
    if (id && apps.some((a) => a.id === id)) return id;
  }
  if (apps.length === 1) return apps[0]!.id;
  return null;
}

export function ActiveAppProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const apiToken = session?.apiToken;
  const [apps, setApps] = useState<AppRow[]>([]);
  const [activeAppId, setActiveAppIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const setActiveAppId = useCallback((id: string | null) => {
    setActiveAppIdState(id);
    writeStoredId(id);
  }, []);

  const refreshApps = useCallback(
    async (preferredId?: string | null) => {
      // Wait for NextAuth — do not treat "no token yet" as empty apps (causes /app redirect).
      if (status === "loading") {
        setLoading(true);
        return;
      }

      if (!apiToken) {
        setApps([]);
        setActiveAppIdState(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await apiFetch<{ apps: AppRow[] }>("/v1/apps", {
          token: apiToken,
        });
        setApps(res.apps);
        const stored = readStoredId();
        const resolved = resolveActiveId(
          res.apps,
          preferredId,
          readUrlAppId(),
          stored,
          activeAppId,
        );
        if (resolved) writeStoredId(resolved);
        else if (stored) writeStoredId(null);
        setActiveAppIdState(resolved);
      } catch {
        setApps([]);
        setActiveAppIdState(null);
      } finally {
        setLoading(false);
      }
    },
    [apiToken, status, activeAppId],
  );

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    void refreshApps();
    // Intentionally only when auth readiness / token changes — not on every activeAppId tweak.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiToken, status]);

  /** Sync active site from a valid /app/[appId] URL (URL wins over stale storage). */
  const adoptAppIdFromUrl = useCallback(
    (urlAppId: string) => {
      if (!apps.some((a) => a.id === urlAppId)) return;
      if (activeAppId !== urlAppId) setActiveAppId(urlAppId);
    },
    [apps, activeAppId, setActiveAppId],
  );

  const activeApp = useMemo(
    () => apps.find((a) => a.id === activeAppId) ?? null,
    [apps, activeAppId],
  );

  const sessionPending = status === "loading";

  const value = useMemo(
    () => ({
      apps,
      activeAppId: hydrated ? activeAppId : null,
      activeApp,
      loading: !hydrated || loading || sessionPending,
      setActiveAppId,
      adoptAppIdFromUrl,
      refreshApps,
    }),
    [
      apps,
      activeAppId,
      activeApp,
      hydrated,
      loading,
      sessionPending,
      setActiveAppId,
      adoptAppIdFromUrl,
      refreshApps,
    ],
  );

  return (
    <ActiveAppContext.Provider value={value}>{children}</ActiveAppContext.Provider>
  );
}

export function useActiveApp() {
  const ctx = useContext(ActiveAppContext);
  if (!ctx) {
    throw new Error("useActiveApp must be used within ActiveAppProvider");
  }
  return ctx;
}

/** Sub-route after /app/[appId], e.g. /traffic or /logs */
export function appSubPath(pathname: string): string {
  const match = pathname.match(/^\/app\/[^/]+(\/.*)?$/);
  return match?.[1] || "/traffic";
}

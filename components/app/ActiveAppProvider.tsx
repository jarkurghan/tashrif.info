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
  refreshApps: () => Promise<void>;
};

const ActiveAppContext = createContext<ActiveAppContextValue | null>(null);

function readStoredId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

function writeStoredId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(STORAGE_KEY, id);
  else localStorage.removeItem(STORAGE_KEY);
}

function resolveActiveId(apps: AppRow[], preferred: string | null): string | null {
  if (apps.length === 0) return null;
  if (preferred && apps.some((a) => a.id === preferred)) return preferred;
  if (apps.length === 1) return apps[0]!.id;
  return null;
}

export function ActiveAppProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const apiToken = session?.apiToken;
  const [apps, setApps] = useState<AppRow[]>([]);
  const [activeAppId, setActiveAppIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const setActiveAppId = useCallback((id: string | null) => {
    setActiveAppIdState(id);
    writeStoredId(id);
  }, []);

  const refreshApps = useCallback(async () => {
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
      const resolved = resolveActiveId(res.apps, stored);
      if (stored && resolved !== stored) writeStoredId(resolved);
      setActiveAppIdState(resolved);
    } catch {
      setApps([]);
      setActiveAppIdState(null);
    } finally {
      setLoading(false);
    }
  }, [apiToken]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    void refreshApps();
  }, [refreshApps]);

  /** First visit: localStorage empty + user opened /app/[id]/... */
  const adoptAppIdFromUrl = useCallback(
    (urlAppId: string) => {
      if (!apps.some((a) => a.id === urlAppId)) return;
      const stored = readStoredId();
      if (!stored) setActiveAppId(urlAppId);
    },
    [apps, setActiveAppId],
  );

  const activeApp = useMemo(
    () => apps.find((a) => a.id === activeAppId) ?? null,
    [apps, activeAppId],
  );

  const value = useMemo(
    () => ({
      apps,
      activeAppId: hydrated ? activeAppId : null,
      activeApp,
      loading: !hydrated || loading,
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

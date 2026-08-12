"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "tashrif_sidebar_collapsed";

type DemoShellContextValue = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggle: () => void;
};

const DemoShellContext = createContext<DemoShellContextValue | null>(null);

export function DemoShellProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCollapsedState(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setCollapsed = useCallback((v: boolean) => {
    setCollapsedState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <DemoShellContext.Provider
      value={{
        collapsed: ready ? collapsed : false,
        setCollapsed,
        toggle,
      }}
    >
      {children}
    </DemoShellContext.Provider>
  );
}

export function useDemoShell() {
  const ctx = useContext(DemoShellContext);
  if (!ctx) throw new Error("useDemoShell must be used within DemoShellProvider");
  return ctx;
}

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
const MOBILE_MQ = "(max-width: 767px)";

function isMobileViewport() {
  return window.matchMedia(MOBILE_MQ).matches;
}

function readStoredCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeStoredCollapsed(v: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
  } catch {
    /* ignore */
  }
}

type DemoShellContextValue = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggle: () => void;
};

const DemoShellContext = createContext<DemoShellContextValue | null>(null);

export function DemoShellProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const apply = () => {
      setCollapsedState(mq.matches ? true : readStoredCollapsed());
    };
    apply();
    setReady(true);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const setCollapsed = useCallback((v: boolean) => {
    setCollapsedState(v);
    if (!isMobileViewport()) writeStoredCollapsed(v);
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((c) => {
      const next = !c;
      if (!isMobileViewport()) writeStoredCollapsed(next);
      return next;
    });
  }, []);

  return (
    <DemoShellContext.Provider
      value={{
        collapsed: ready ? collapsed : true,
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

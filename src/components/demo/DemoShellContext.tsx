"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type DemoShellContextValue = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggle: () => void;
};

const DemoShellContext = createContext<DemoShellContextValue | null>(null);

export function DemoShellProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <DemoShellContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggle: () => setCollapsed((c) => !c),
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

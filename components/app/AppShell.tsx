"use client";

import { DemoShellProvider } from "@/components/demo/DemoShellContext";
import { ActiveAppProvider } from "@/components/app/ActiveAppProvider";
import { AppSidebar } from "@/components/app/AppSidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoShellProvider>
      <ActiveAppProvider>
        <div className="flex h-dvh overflow-hidden bg-background">
          <AppSidebar />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </div>
      </ActiveAppProvider>
    </DemoShellProvider>
  );
}

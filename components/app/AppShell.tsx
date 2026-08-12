"use client";

import { DemoShellProvider } from "@/components/demo/DemoShellContext";
import { ActiveAppProvider } from "@/components/app/ActiveAppProvider";
import { AppSidebar } from "@/components/app/AppSidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoShellProvider>
      <ActiveAppProvider>
        <div className="flex min-h-dvh bg-background">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
      </ActiveAppProvider>
    </DemoShellProvider>
  );
}

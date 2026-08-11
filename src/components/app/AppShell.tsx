"use client";

import { useParams } from "next/navigation";
import { DemoShellProvider } from "@/components/demo/DemoShellContext";
import { AppSidebar } from "@/components/app/AppSidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const appId = typeof params.appId === "string" ? params.appId : undefined;

  return (
    <DemoShellProvider>
      <div className="flex min-h-dvh bg-background">
        <AppSidebar appId={appId} />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </DemoShellProvider>
  );
}

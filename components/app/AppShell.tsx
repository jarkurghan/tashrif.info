"use client";

import { DemoShellProvider } from "@/components/demo/DemoShellContext";
import { ActiveAppProvider } from "@/components/app/ActiveAppProvider";
import { InviteInboxProvider } from "@/components/app/InviteInboxProvider";
import { InviteWarningBanner } from "@/components/app/IncomingInvites";
import { AppSidebar } from "@/components/app/AppSidebar";
import { LocaleSync } from "@/components/LocaleSync";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoShellProvider>
      <ActiveAppProvider>
        <InviteInboxProvider>
          <LocaleSync />
          <div className="flex h-dvh overflow-hidden bg-background">
            <AppSidebar />
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <InviteWarningBanner />
              {children}
            </div>
          </div>
        </InviteInboxProvider>
      </ActiveAppProvider>
    </DemoShellProvider>
  );
}

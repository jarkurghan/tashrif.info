"use client";

import { DemoShellProvider } from "@/components/demo/DemoShellContext";
import { ActiveAppProvider } from "@/components/app/ActiveAppProvider";
import { InviteInboxProvider } from "@/components/app/InviteInboxProvider";
import { InviteWarningBanner } from "@/components/app/IncomingInvites";
import { AppSidebar } from "@/components/app/AppSidebar";
import { LocaleSync } from "@/components/LocaleSync";
import { DateRangeProvider } from "@/components/app/DateRangeProvider";
import { useDemoShell } from "@/components/demo/DemoShellContext";

function MobileSidebarBackdrop() {
  const { collapsed, setCollapsed } = useDemoShell();
  if (collapsed) return null;
  return (
    <button
      type="button"
      aria-label="Close menu"
      className="fixed inset-0 z-40 bg-foreground/30 md:hidden"
      onClick={() => setCollapsed(true)}
    />
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoShellProvider>
      <ActiveAppProvider>
        <InviteInboxProvider>
          <DateRangeProvider>
          <LocaleSync />
          <div className="flex h-dvh overflow-hidden bg-background">
            <AppSidebar />
            <MobileSidebarBackdrop />
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <InviteWarningBanner />
              {children}
            </div>
          </div>
          </DateRangeProvider>
        </InviteInboxProvider>
      </ActiveAppProvider>
    </DemoShellProvider>
  );
}

"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useDemoShell } from "@/components/demo/DemoShellContext";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useLiveVisitors } from "@/lib/use-live";
import { CalendarDays, PanelLeft } from "lucide-react";

export function AppHeader({ title }: { title: string }) {
  const t = useTranslations("demo");
  const { toggle } = useDemoShell();
  const { data } = useSession();
  const { activeAppId } = useActiveApp();
  const live = useLiveVisitors(activeAppId ?? undefined, data?.apiToken);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={toggle}
        className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition hover:text-foreground"
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-4 w-4" />
      </button>

      <h1 className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight">
        {title}
      </h1>

      {activeAppId && (
        <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm sm:flex">
          <span className="live-dot inline-block h-2 w-2 rounded-full bg-success" />
          <span className="text-muted-foreground">
            {t("live", { count: live })}
          </span>
        </div>
      )}

      <div className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-muted-foreground md:flex">
        <CalendarDays className="h-3.5 w-3.5" />
        {t("dateRange")}
      </div>

      <LanguageSelect />

      <button
        type="button"
        title={data?.user?.name ?? "Account"}
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-sm font-semibold text-primary"
      >
        {data?.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.user.image} alt="" className="h-full w-full object-cover" />
        ) : (
          (data?.user?.name?.[0] ?? "U").toUpperCase()
        )}
      </button>
    </header>
  );
}

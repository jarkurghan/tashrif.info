"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useDemoShell } from "./DemoShellContext";
import { LIVE_VISITORS } from "@/lib/demo-data";
import { CalendarDays, PanelLeft } from "lucide-react";

const titleKeyByPath: Record<string, string> = {
  "/demo": "traffic",
  "/demo/traffic": "traffic",
  "/demo/pages": "pages",
  "/demo/locations": "locations",
  "/demo/events": "events",
  "/demo/logs": "logs",
  "/demo/domains": "domains",
  "/demo/access": "access",
  "/demo/reports": "reports",
};

export function DemoHeader() {
  const t = useTranslations("demo");
  const pathname = usePathname();
  const { toggle } = useDemoShell();
  const key = titleKeyByPath[pathname] ?? "traffic";

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
        {t(`titles.${key}` as "titles.traffic")}
      </h1>

      <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm sm:flex">
        <span className="live-dot inline-block h-2 w-2 rounded-full bg-success" />
        <span className="text-muted-foreground">
          {t("live", { count: LIVE_VISITORS })}
        </span>
      </div>

      <div className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-muted-foreground md:flex">
        <CalendarDays className="h-3.5 w-3.5" />
        {t("dateRange")}
      </div>

      <LanguageSelect />

      <div
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary"
        title="Demo User"
      >
        DU
      </div>
    </header>
  );
}

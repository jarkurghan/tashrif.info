"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useDemoShell } from "./DemoShellContext";
import { DemoUserMenu } from "./DemoUserMenu";
import { DateRangePicker } from "@/components/app/DateRangePicker";
import { isAnalyticsPath } from "@/lib/date-range";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const titleKeyByPath: Record<string, "home" | "traffic" | "pages" | "logs" | "domains" | "access" | "reports"> =
  {
    "/demo": "home",
    "/demo/home": "home",
    "/demo/traffic": "traffic",
    "/demo/pages": "pages",
    "/demo/logs": "logs",
    "/demo/domains": "domains",
    "/demo/access": "access",
    "/demo/reports": "reports",
  };

export function DemoHeader() {
  const t = useTranslations("demo");
  const pathname = usePathname();
  const { collapsed, toggle } = useDemoShell();
  const key = titleKeyByPath[pathname] ?? "home";
  const showRange = isAnalyticsPath(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 min-h-16 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={toggle}
        className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition hover:text-foreground"
        aria-label={collapsed ? (t.has("expand") ? t("expand") : "Expand") : t("collapse")}
        title={collapsed ? (t.has("expand") ? t("expand") : "Expand") : t("collapse")}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>

      <h1 className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight">
        {t(`titles.${key}`)}
      </h1>

      {showRange ? <DateRangePicker /> : null}

      <LanguageSelect />
      <DemoUserMenu />
    </header>
  );
}

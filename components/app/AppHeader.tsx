"use client";

import { useTranslations } from "next-intl";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useDemoShell } from "@/components/demo/DemoShellContext";
import { UserMenu } from "@/components/app/UserMenu";
import { CalendarDays, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function AppHeader({ title }: { title: string }) {
  const t = useTranslations("demo");
  const { collapsed, toggle } = useDemoShell();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
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
        {title}
      </h1>

      <div className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-muted-foreground md:flex">
        <CalendarDays className="h-3.5 w-3.5" />
        {t("dateRange")}
      </div>

      <LanguageSelect />

      <UserMenu />
    </header>
  );
}

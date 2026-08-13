"use client";

import { useTranslations } from "next-intl";
import { useDemoShell } from "./DemoShellContext";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { Globe } from "lucide-react";

const DEMO_SITE = "bozor.uz";

export function DemoSiteSelect() {
  const t = useTranslations("demo.siteSelect");
  const { collapsed } = useDemoShell();

  return (
    <div className="border-b border-border px-2 py-3">
      <div
        className={cn(
          "relative transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          collapsed ? "h-9 overflow-hidden" : "h-[4rem] overflow-visible",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            collapsed ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <div className="px-0.5">
            <span className="mb-1.5 block px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("label")}
            </span>
            <Select
              aria-label={t("label")}
              value={DEMO_SITE}
              onChange={() => undefined}
              options={[{ value: DEMO_SITE, label: DEMO_SITE }]}
            />
          </div>
        </div>
        <button
          type="button"
          title={DEMO_SITE}
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-lg text-muted-foreground transition-opacity duration-300",
            collapsed ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Globe className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

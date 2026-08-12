"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useActiveApp, appSubPath } from "@/components/app/ActiveAppProvider";
import { useDemoShell } from "@/components/demo/DemoShellContext";
import { cn } from "@/lib/cn";
import { Globe } from "lucide-react";

export function SiteSelect() {
  const t = useTranslations("demo.siteSelect");
  const { apps, activeAppId, setActiveAppId, loading } = useActiveApp();
  const { collapsed } = useDemoShell();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <div
        className={cn(
          "mx-2 mb-3 h-9 animate-pulse rounded-lg bg-muted/60",
          collapsed && "mx-auto w-9",
        )}
      />
    );
  }

  if (apps.length === 0) {
    if (collapsed) return null;
    return (
      <p className="mx-2 mb-3 px-1 text-xs text-muted-foreground">{t("empty")}</p>
    );
  }

  function onChange(nextId: string) {
    if (!nextId || nextId === activeAppId) return;
    setActiveAppId(nextId);
    const sub = pathname.startsWith("/app/") && pathname !== "/app"
      ? appSubPath(pathname)
      : "/traffic";
    router.replace(`/app/${nextId}${sub}`);
  }

  return (
    <div
      className={cn(
        "mx-2 mb-3",
        collapsed && "flex justify-center",
      )}
    >
      <label className={cn("block w-full", collapsed && "w-9")}>
        {!collapsed && (
          <span className="mb-1.5 block px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("label")}
          </span>
        )}
        <div className="relative">
          {collapsed && (
            <Globe
              className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          )}
          <select
            value={activeAppId ?? ""}
            onChange={(e) => onChange(e.target.value)}
            aria-label={t("label")}
            className={cn(
              "w-full appearance-none rounded-lg border border-border bg-background py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40",
              collapsed
                ? "h-9 cursor-pointer pl-8 pr-1 text-transparent"
                : "px-3 pr-8",
            )}
          >
            {!activeAppId && (
              <option value="" disabled>
                {t("placeholder")}
              </option>
            )}
            {apps.map((app) => (
              <option key={app.id} value={app.id}>
                {app.domain}
              </option>
            ))}
          </select>
        </div>
      </label>
    </div>
  );
}

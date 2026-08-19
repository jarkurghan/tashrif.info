"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useActiveApp, appSubPath } from "@/components/app/ActiveAppProvider";
import { useDemoShell } from "@/components/demo/DemoShellContext";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { Globe } from "lucide-react";

export function SiteSelect() {
  const t = useTranslations("demo.siteSelect");
  const { apps, activeAppId, setActiveAppId, loading } = useActiveApp();
  const { collapsed, setCollapsed } = useDemoShell();
  const pathname = usePathname();
  const router = useRouter();

  function onChange(nextId: string) {
    if (!nextId || nextId === activeAppId) return;
    setActiveAppId(nextId);
    const sub =
      pathname.startsWith("/app/") && pathname !== "/app"
        ? appSubPath(pathname)
        : "/home";
    router.replace(`/app/${nextId}${sub}`);
  }

  const active = apps.find((a) => a.id === activeAppId);

  if (loading) {
    return (
      <div className="border-b border-border px-2 py-3">
        <div
          className={cn(
            "h-9 animate-pulse rounded-lg bg-muted/60 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            collapsed ? "w-9" : "w-full",
          )}
        />
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div
        className={cn(
          "overflow-hidden border-b border-border px-2 transition-[max-height,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          collapsed ? "max-h-0 py-0" : "max-h-24 py-3",
        )}
      >
        <p className="px-2.5 text-xs leading-relaxed text-muted-foreground">
          {t("empty")}
        </p>
      </div>
    );
  }

  const options = [
    ...(!activeAppId
      ? [{ value: "", label: t("placeholder"), disabled: true as const }]
      : []),
    ...apps.map((app) => ({ value: app.id, label: app.domain })),
  ];

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
              tabIndex={collapsed ? -1 : 0}
              value={activeAppId ?? ""}
              onChange={onChange}
              placeholder={t("placeholder")}
              options={options}
              className="px-0.5"
            />
          </div>
        </div>

        <div
          className={cn(
            "absolute left-0 top-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            collapsed ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <button
            type="button"
            title={active?.domain ?? t("label")}
            onClick={() => setCollapsed(false)}
            tabIndex={collapsed ? 0 : -1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t("label")}
          >
            <Globe className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

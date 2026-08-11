"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useDemoShell } from "@/components/demo/DemoShellContext";
import { cn } from "@/lib/cn";
import {
  Activity,
  BarChart3,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MapPinned,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  Send,
  Settings,
  Users,
} from "lucide-react";

export function AppSidebar({ appId }: { appId?: string }) {
  const t = useTranslations("demo");
  const pathname = usePathname();
  const { collapsed, toggle } = useDemoShell();

  const base = appId ? `/app/${appId}` : "/app";

  const analytics = appId
    ? ([
        { href: `${base}/traffic`, key: "traffic", icon: LayoutDashboard },
        { href: `${base}/pages`, key: "pages", icon: FileText },
        { href: `${base}/locations`, key: "locations", icon: MapPinned },
        { href: `${base}/events`, key: "events", icon: BarChart3 },
        { href: `${base}/logs`, key: "logs", icon: ScrollText },
      ] as const)
    : [];

  const manage = appId
    ? ([
        { href: `${base}/access`, key: "access", icon: Users },
        { href: `${base}/reports`, key: "reports", icon: Send },
      ] as const)
    : [];

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-dvh shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center gap-2 border-b border-border px-3",
          collapsed && "justify-center",
        )}
      >
        <Link
          href="/app"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <Activity className="h-4 w-4" />
        </Link>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">tashrif.info</p>
            <p className="truncate text-xs text-muted-foreground">Dashboard</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <Link
          href="/app"
          className={cn(
            "mb-4 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
            pathname === "/app"
              ? "bg-sidebar-active font-medium text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          <FolderKanban className="h-4 w-4" />
          {!collapsed && <span>{t("nav.domains")}</span>}
        </Link>

        {analytics.length > 0 && (
          <div>
            {!collapsed && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("sections.analytics")}
              </p>
            )}
            <ul className="space-y-1">
              {analytics.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                        active
                          ? "bg-sidebar-active font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{t(`nav.${item.key}`)}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {manage.length > 0 && (
          <div className="mt-6">
            {!collapsed && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("sections.manage")}
              </p>
            )}
            <ul className="space-y-1">
              {manage.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                        active
                          ? "bg-sidebar-active font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{t(`nav.${item.key}`)}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <Link
          href="/settings"
          className={cn(
            "mt-6 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </nav>

      <button
        type="button"
        onClick={toggle}
        className={cn(
          "m-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
          collapsed && "justify-center px-0",
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <>
            <PanelLeftClose className="h-4 w-4" />
            {t("collapse")}
          </>
        )}
      </button>
    </aside>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useDemoShell } from "./DemoShellContext";
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
  Users,
} from "lucide-react";

const analytics = [
  { href: "/demo/traffic", key: "traffic", icon: LayoutDashboard },
  { href: "/demo/pages", key: "pages", icon: FileText },
  { href: "/demo/locations", key: "locations", icon: MapPinned },
  { href: "/demo/events", key: "events", icon: BarChart3 },
  { href: "/demo/logs", key: "logs", icon: ScrollText },
] as const;

const manage = [
  { href: "/demo/domains", key: "domains", icon: FolderKanban },
  { href: "/demo/access", key: "access", icon: Users },
  { href: "/demo/reports", key: "reports", icon: Send },
] as const;

export function DemoSidebar() {
  const t = useTranslations("demo");
  const pathname = usePathname();
  const { collapsed, toggle } = useDemoShell();

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200",
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
          href="/"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <Activity className="h-4 w-4" />
        </Link>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{t("siteName")}</p>
            <p className="truncate text-xs text-muted-foreground">tashrif.info</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <NavGroup
          label={t("sections.analytics")}
          items={analytics}
          pathname={pathname}
          collapsed={collapsed}
          t={t}
        />
        <NavGroup
          label={t("sections.manage")}
          items={manage}
          pathname={pathname}
          collapsed={collapsed}
          t={t}
          className="mt-6"
        />
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

function NavGroup({
  label,
  items,
  pathname,
  collapsed,
  t,
  className,
}: {
  label: string;
  items: readonly { href: string; key: string; icon: React.ComponentType<{ className?: string }> }[];
  pathname: string;
  collapsed: boolean;
  t: ReturnType<typeof useTranslations<"demo">>;
  className?: string;
}) {
  return (
    <div className={className}>
      {!collapsed && (
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      )}
      <ul className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                title={collapsed ? t(`nav.${item.key}` as "nav.traffic") : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-sidebar-active font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-0",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span>
                    {t(`nav.${item.key}` as "nav.traffic")}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

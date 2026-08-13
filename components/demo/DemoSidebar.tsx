"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useDemoShell } from "./DemoShellContext";
import { cn } from "@/lib/cn";
import {
  Activity,
  FileText,
  FolderKanban,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  Send,
  Users,
} from "lucide-react";

const analytics = [
  { href: "/demo/traffic", key: "traffic", icon: LayoutDashboard },
  { href: "/demo/pages", key: "pages", icon: FileText },
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
  const { collapsed, toggle, setCollapsed } = useDemoShell();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    if (mq.matches) setCollapsed(true);
  }, [pathname, setCollapsed]);

  return (
    <>
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar",
        "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-64 max-md:transition-transform max-md:duration-300",
        collapsed
          ? "max-md:-translate-x-full md:w-[72px]"
          : "w-64 max-md:translate-x-0",
        "md:relative md:shrink-0 md:transition-[width] md:duration-200",
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
    {!collapsed && (
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 z-40 bg-foreground/30 md:hidden"
        onClick={() => setCollapsed(true)}
      />
    )}
    </>
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

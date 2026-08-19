"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useDemoShell } from "@/components/demo/DemoShellContext";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useInviteInbox } from "@/components/app/InviteInboxProvider";
import { SiteSelect } from "@/components/app/SiteSelect";
import { cn } from "@/lib/cn";
import {
  Activity,
  FileText,
  Home,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  Send,
  Users,
  type LucideIcon,
} from "lucide-react";

const RAIL = "px-2";
const ITEM =
  "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors";
const EASE = "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

function FadeLabel({
  collapsed,
  children,
  className,
}: {
  collapsed: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden={collapsed}
      className={cn(
        "min-w-0 overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        collapsed ? "max-w-0 opacity-0" : "max-w-[11rem] opacity-100",
        className,
      )}
    >
      {children}
    </span>
  );
}

function SectionLabel({
  collapsed,
  children,
}: {
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "overflow-hidden px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-[opacity,max-height,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        collapsed ? "mb-0 max-h-0 opacity-0" : "mb-2 max-h-6 opacity-100",
      )}
    >
      {children}
    </p>
  );
}

function NavIconLink({
  href,
  active,
  collapsed,
  label,
  icon: Icon,
  badge,
}: {
  href: string;
  active: boolean;
  collapsed: boolean;
  label: string;
  icon: LucideIcon;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-label={label}
      className={cn(
        ITEM,
        active
          ? "bg-sidebar-active font-medium text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <span className="relative shrink-0">
        <Icon className="h-4 w-4" />
        {collapsed && badge ? (
          <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-accent" />
        ) : null}
      </span>
      <FadeLabel collapsed={collapsed}>{label}</FadeLabel>
      {!collapsed && badge ? (
        <span className="ml-auto rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-accent">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export function AppSidebar() {
  const t = useTranslations("demo");
  const pathname = usePathname();
  const { collapsed, toggle, setCollapsed } = useDemoShell();
  const { activeAppId, apps, loading, activeApp } = useActiveApp();
  const { invites } = useInviteInbox();

  const base = activeAppId ? `/app/${activeAppId}` : null;
  const canManage =
    activeApp?.role === "admin" || activeApp?.role === "owner";

  const analytics = base
    ? ([
        { href: `${base}/home`, key: "home", icon: Home },
        { href: `${base}/traffic`, key: "traffic", icon: LayoutDashboard },
        { href: `${base}/pages`, key: "pages", icon: FileText },
        { href: `${base}/logs`, key: "logs", icon: ScrollText },
      ] as const)
    : [];

  const manage =
    base && canManage
      ? ([
          { href: `${base}/access`, key: "access", icon: Users },
          { href: `${base}/reports`, key: "reports", icon: Send },
        ] as const)
      : [];

  const showEmptyHint = !loading && (apps.length === 0 || !activeAppId);
  const expandLabel = t.has("expand") ? t("expand") : "Expand";

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    if (mq.matches) setCollapsed(true);
  }, [pathname, setCollapsed]);

  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden border-r border-border bg-sidebar",
        EASE,
        "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-64 max-md:transition-transform",
        collapsed
          ? "max-md:-translate-x-full md:w-[68px]"
          : "w-64 max-md:translate-x-0",
        "md:relative md:shrink-0 md:transition-[width]",
      )}
    >
      <div className={cn("flex h-16 shrink-0 items-center gap-2 border-b border-border", RAIL)}>
        <Link
          href={activeAppId ? `/app/${activeAppId}/home` : "/app"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          aria-label="tashrif.info"
          title="tashrif.info"
        >
          <Activity className="h-4 w-4" />
        </Link>
        <FadeLabel collapsed={collapsed} className="flex flex-col leading-tight">
          <span className="truncate text-sm font-semibold">tashrif.info</span>
          <span className="truncate text-xs text-muted-foreground">Dashboard</span>
        </FadeLabel>
      </div>

      <SiteSelect />

      <nav className={cn("flex min-h-0 flex-1 flex-col overflow-hidden py-3", RAIL)}>
        <div className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto">
          {analytics.length > 0 && (
            <div>
              <SectionLabel collapsed={collapsed}>
                {t("sections.analytics")}
              </SectionLabel>
              <ul className="space-y-1">
                {analytics.map((item) => (
                  <li key={item.href}>
                    <NavIconLink
                      href={item.href}
                      active={pathname === item.href}
                      collapsed={collapsed}
                      label={t(`nav.${item.key}`)}
                      icon={item.icon}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {manage.length > 0 && (
            <div className={cn("pt-4", collapsed && "pt-2")}>
              <SectionLabel collapsed={collapsed}>
                {t("sections.manage")}
              </SectionLabel>
              <div
                className={cn(
                  "mb-2 ml-2.5 h-px w-6 bg-border transition-opacity duration-300",
                  collapsed ? "opacity-100" : "opacity-0",
                )}
                aria-hidden
              />
              <ul className="space-y-1">
                {manage.map((item) => (
                  <li key={item.href}>
                    <NavIconLink
                      href={item.href}
                      active={pathname === item.href}
                      collapsed={collapsed}
                      label={t(`nav.${item.key}`)}
                      icon={item.icon}
                      badge={item.key === "access" ? invites.length : undefined}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showEmptyHint && (
            <p
              className={cn(
                "overflow-hidden px-2.5 text-xs leading-relaxed text-muted-foreground transition-[opacity,max-height] duration-300",
                collapsed ? "max-h-0 opacity-0" : "max-h-20 opacity-100",
              )}
            >
              {apps.length === 0
                ? t("siteSelect.empty")
                : t("siteSelect.placeholder")}
            </p>
          )}
        </div>
      </nav>

      <div className={cn("shrink-0 border-t border-border py-2", RAIL)}>
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? expandLabel : t("collapse")}
          aria-label={collapsed ? expandLabel : t("collapse")}
          className={cn(
            ITEM,
            "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <span className="relative h-4 w-4 shrink-0">
            <PanelLeftClose
              className={cn(
                "absolute inset-0 h-4 w-4 transition-opacity duration-300",
                collapsed ? "opacity-0" : "opacity-100",
              )}
            />
            <PanelLeftOpen
              className={cn(
                "absolute inset-0 h-4 w-4 transition-opacity duration-300",
                collapsed ? "opacity-100" : "opacity-0",
              )}
            />
          </span>
          <FadeLabel collapsed={collapsed}>{t("collapse")}</FadeLabel>
        </button>
      </div>
    </aside>
  );
}

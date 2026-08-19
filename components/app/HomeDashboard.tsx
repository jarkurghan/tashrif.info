"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Activity,
  Eye,
  MousePointerClick,
  Users,
  type LucideIcon,
} from "lucide-react";
import { HomeSparkline } from "@/components/app/HomeSparkline";
import { HomeDonut } from "@/components/app/HomeDonut";
import { HomeAreaChart } from "@/components/app/HomeAreaChart";
import { HomeGauge } from "@/components/app/HomeGauge";
import { HomeRings } from "@/components/app/HomeRings";
import { HomeFunnel } from "@/components/app/HomeFunnel";
import { HomeSplit } from "@/components/app/HomeSplit";
import { HomeDevice } from "@/components/app/HomeDevice";
import { HomeIntensity } from "@/components/app/HomeIntensity";
import { TrendBadge } from "@/components/demo/TrendBadge";
import {
  groupByBrowser,
  groupByDevice,
  groupByOs,
} from "@/lib/parse-user-agent";
import { formatCount, type RankedItem } from "@/lib/demo-data";
import { cn } from "@/lib/cn";

export type DashboardOverview = {
  users: number;
  pageviews: number;
  newUsers: number;
  sessions: number;
  bounceRate: number;
  lastVisit: string | null;
  previous?: {
    users: number;
    pageviews: number;
    newUsers: number;
    sessions: number;
    bounceRate?: number;
  };
};

export type HomeDashboardProps = {
  overview: DashboardOverview | null;
  series: { date: string; sessions: number; pageviews: number }[];
  referrers: RankedItem[];
  uaRaw: { label: string; value: number }[];
  setupHref?: string;
};

function pctDelta(current: number, previous?: number) {
  if (previous == null) return { text: "", positive: true };
  if (previous === 0) {
    if (current === 0) return { text: "0%", positive: true };
    return { text: "+100%", positive: true };
  }
  const d = ((current - previous) / previous) * 100;
  if (Math.abs(d) < 0.5) return { text: "0%", positive: true };
  const sign = d > 0 ? "+" : "";
  return { text: `${sign}${d.toFixed(0)}%`, positive: d >= 0 };
}

function bounceDelta(current: number, previous?: number) {
  if (previous == null) return { text: "", positive: true };
  const d = (current - previous) * 100;
  if (Math.abs(d) < 0.5) return { text: "0%", positive: true };
  const sign = d > 0 ? "+" : "";
  return { text: `${sign}${d.toFixed(0)}pp`, positive: d <= 0 };
}

function formatBounce(rate: number) {
  return `${Math.round(rate * 100)}%`;
}

export function HomeDashboard({
  overview,
  series,
  referrers,
  uaRaw,
  setupHref,
}: HomeDashboardProps) {
  const t = useTranslations("demo");
  const th = useTranslations("demo.home");

  const mappedReferrers = useMemo(
    () =>
      referrers.map((i) => ({
        ...i,
        label: i.label === "(direct)" ? t("tabs.direct") : i.label,
      })),
    [referrers, t],
  );

  const browsers = useMemo(() => groupByBrowser(uaRaw), [uaRaw]);
  const oses = useMemo(() => groupByOs(uaRaw), [uaRaw]);
  const devices = useMemo(() => groupByDevice(uaRaw), [uaRaw]);

  const usersSpark = useMemo(
    () => series.map((p) => ({ v: p.sessions })),
    [series],
  );
  const viewsSpark = useMemo(
    () => series.map((p) => ({ v: p.pageviews })),
    [series],
  );
  const sessSpark = useMemo(
    () => series.map((p) => ({ v: p.sessions })),
    [series],
  );

  const usersTrend = pctDelta(overview?.users ?? 0, overview?.previous?.users);
  const viewsTrend = pctDelta(
    overview?.pageviews ?? 0,
    overview?.previous?.pageviews,
  );
  const sessTrend = pctDelta(
    overview?.sessions ?? 0,
    overview?.previous?.sessions,
  );
  const bounceTrend = bounceDelta(
    overview?.bounceRate ?? 0,
    overview?.previous?.bounceRate,
  );

  const pagesPerSession =
    overview && overview.sessions > 0
      ? overview.pageviews / overview.sessions
      : null;
  const newShare =
    overview && overview.users > 0
      ? overview.newUsers / overview.users
      : null;
  const returning = Math.max(
    0,
    (overview?.users ?? 0) - (overview?.newUsers ?? 0),
  );

  const showSetup =
    Boolean(setupHref) && overview != null && overview.lastVisit === null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12">
      <KpiBlock
        className="xl:col-span-3"
        icon={Users}
        label={t("metrics.users")}
        value={overview ? formatCount(overview.users) : "—"}
        trend={usersTrend.text}
        positive={usersTrend.positive}
        spark={usersSpark}
        color="var(--chart-1)"
        featured
      />
      <KpiBlock
        className="xl:col-span-3"
        icon={Eye}
        label={t("metrics.pageviews")}
        value={overview ? formatCount(overview.pageviews) : "—"}
        trend={viewsTrend.text}
        positive={viewsTrend.positive}
        spark={viewsSpark}
        color="var(--chart-3)"
      />
      <KpiBlock
        className="xl:col-span-3"
        icon={Activity}
        label={t("charts.sessions")}
        value={overview ? formatCount(overview.sessions) : "—"}
        trend={sessTrend.text}
        positive={sessTrend.positive}
        spark={sessSpark}
        color="var(--chart-2)"
      />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm xl:col-span-3">
        <MousePointerClick className="absolute right-3 top-3 h-4 w-4 text-muted-foreground/70" />
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {th("pagesPerSession")}
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
          {pagesPerSession != null ? pagesPerSession.toFixed(1) : "—"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {th("newShare")}:{" "}
          <span className="font-medium tabular-nums text-foreground">
            {newShare != null ? `${Math.round(newShare * 100)}%` : "—"}
          </span>
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.round((newShare ?? 0) * 100)}%` }}
          />
        </div>
      </div>

      {showSetup && setupHref ? (
        <div className="rounded-2xl border border-primary/25 bg-primary-soft/30 px-4 py-3.5 sm:col-span-2 sm:px-5 xl:col-span-12">
          <p className="text-sm font-semibold tracking-tight">{t("setupTitle")}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t("setupBody")}
          </p>
          <Link
            href={setupHref}
            className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
          >
            {t("setupCta")}
          </Link>
        </div>
      ) : null}

      <div className="sm:col-span-2 xl:col-span-8">
        <HomeAreaChart title={th("traffic")} series={series} />
      </div>
      <div className="xl:col-span-4">
        <HomeGauge
          title={th("bounce")}
          hint={th("bounceHint")}
          value={overview?.bounceRate ?? 0}
          label={overview ? formatBounce(overview.bounceRate) : "—"}
          trend={
            bounceTrend.text ? (
              <TrendBadge
                value={bounceTrend.text}
                positive={bounceTrend.positive}
              />
            ) : null
          }
        />
      </div>

      <div className="sm:col-span-2 xl:col-span-7">
        <HomeFunnel
          title={th("funnel")}
          empty={t("empty")}
          steps={[
            { label: t("metrics.users"), value: overview?.users ?? 0 },
            { label: t("charts.sessions"), value: overview?.sessions ?? 0 },
            { label: t("metrics.pageviews"), value: overview?.pageviews ?? 0 },
          ]}
        />
      </div>
      <div className="sm:col-span-2 xl:col-span-5">
        <HomeSplit
          title={th("newVsReturning")}
          leftLabel={t("metrics.newUsers")}
          rightLabel={th("returning")}
          left={overview?.newUsers ?? 0}
          right={returning}
          empty={t("empty")}
        />
      </div>

      <div className="sm:col-span-2 xl:col-span-7">
        <HomeDevice title={th("devices")} items={devices} empty={t("empty")} />
      </div>
      <div className="sm:col-span-2 xl:col-span-5">
        <HomeIntensity
          title={th("depth")}
          hint={th("depthHint")}
          series={series}
          empty={t("empty")}
        />
      </div>

      <div className="xl:col-span-4">
        <HomeDonut
          title={th("sources")}
          items={mappedReferrers}
          empty={t("empty")}
          centerLabel={th("sources")}
        />
      </div>
      <div className="xl:col-span-4">
        <HomeRings title={t("tabs.browser")} items={browsers} empty={t("empty")} />
      </div>
      <div className="xl:col-span-4">
        <HomeRings title={t("tabs.os")} items={oses} empty={t("empty")} />
      </div>
    </div>
  );
}

function KpiBlock({
  icon: Icon,
  label,
  value,
  trend,
  positive,
  spark,
  color,
  className,
  featured,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  trend: string;
  positive: boolean;
  spark: { v: number }[];
  color: string;
  className?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border p-4 shadow-sm",
        featured
          ? "bg-gradient-to-br from-primary-soft/80 via-card to-card"
          : "bg-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        {trend && trend !== "—" ? (
          <TrendBadge value={trend} positive={positive} />
        ) : null}
      </div>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <div className="-mx-1 mt-2">
        <HomeSparkline data={spark} color={color} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MetricCard } from "@/components/demo/MetricCard";
import { RankedList } from "@/components/demo/RankedList";
import { TrafficMap } from "@/components/app/TrafficMap";
import { TrafficChart } from "@/components/app/TrafficChart";
import { Link } from "@/i18n/navigation";
import {
  groupByBrowser,
  groupByOs,
  groupByParsedUserAgent,
} from "@/lib/parse-user-agent";
import { countryLabel, flagEmoji } from "@/lib/geo-display";
import { formatCount, type RankedItem } from "@/lib/demo-data";

export type PeriodStats = {
  users: number;
  pageviews: number;
  newUsers: number;
};

export type TrafficOverview = PeriodStats & {
  lastVisit: string | null;
  previous?: PeriodStats;
};

function trendOf(current: number, previous?: number) {
  if (previous == null) return { text: "", positive: true };
  const d = current - previous;
  if (d === 0) return { text: "0", positive: true };
  const sign = d > 0 ? "+" : "";
  return { text: `${sign}${formatCount(d)}`, positive: d >= 0 };
}

function viewsPerUser(pageviews: number, users: number) {
  if (users <= 0) return null;
  return pageviews / users;
}

function ratioTrend(current: number | null, previous: number | null) {
  if (current == null || previous == null) return { text: "", positive: true };
  const d = current - previous;
  if (Math.abs(d) < 0.05) return { text: "0", positive: true };
  const sign = d > 0 ? "+" : "";
  return { text: `${sign}${d.toFixed(1)}`, positive: d >= 0 };
}

function formatLastVisit(iso: string | null, locale: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const age = Date.now() - d.getTime();
  const day = 24 * 60 * 60 * 1000;
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  };
  if (age >= day) {
    opts.day = "numeric";
    opts.month = "short";
    if (age >= 365 * day) opts.year = "numeric";
  }
  const tags = locale.startsWith("uz") ? ["uz-Latn-UZ", "en-GB"] : [locale, "en-GB"];
  for (const tag of tags) {
    try {
      const formatted = new Intl.DateTimeFormat(tag, opts).format(d);
      if (!/[\u0400-\u04FF]/.test(formatted)) return formatted;
    } catch {
      /* try next */
    }
  }
  return new Intl.DateTimeFormat("en-GB", opts).format(d);
}

export type TrafficDashboardProps = {
  overview: TrafficOverview | null;
  series: { date: string; sessions: number; pageviews: number }[];
  pages: RankedItem[];
  locations: RankedItem[];
  referrers: RankedItem[];
  uaRaw: { label: string; value: number }[];
  print?: boolean;
  setupHref?: string;
};

export function TrafficDashboard({
  overview,
  series,
  pages,
  locations,
  referrers,
  uaRaw,
  print,
  setupHref,
}: TrafficDashboardProps) {
  const t = useTranslations("demo");
  const locale = useLocale();
  const [printReady, setPrintReady] = useState(false);

  useEffect(() => {
    if (!print) return;
    const timer = setTimeout(() => setPrintReady(true), 2000);
    return () => clearTimeout(timer);
  }, [print]);

  const mappedLocations = useMemo(
    () =>
      locations.map((i) => {
        const code = i.code ?? (i.label.length === 2 ? i.label : undefined);
        return {
          ...i,
          code,
          label:
            code && code !== "??"
              ? countryLabel(code, locale)
              : t("tabs.unknown"),
          flag: flagEmoji(code),
        };
      }),
    [locations, locale, t],
  );

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
  const userAgents = useMemo(() => groupByParsedUserAgent(uaRaw), [uaRaw]);

  const usersTrend = trendOf(overview?.users ?? 0, overview?.previous?.users);
  const viewsTrend = trendOf(
    overview?.pageviews ?? 0,
    overview?.previous?.pageviews,
  );
  const newTrend = trendOf(
    overview?.newUsers ?? 0,
    overview?.previous?.newUsers,
  );
  const perUser = overview
    ? viewsPerUser(overview.pageviews, overview.users)
    : null;
  const perUserPrev = overview?.previous
    ? viewsPerUser(overview.previous.pageviews, overview.previous.users)
    : null;
  const perUserTrend = ratioTrend(perUser, perUserPrev);

  const showSetup =
    Boolean(setupHref) && !print && overview != null && overview.lastVisit === null;

  return (
    <div
      className="space-y-5"
      {...(print && printReady ? { "data-print-ready": "true" } : {})}
    >
      <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-5">
        <MetricCard
          label={t("metrics.users")}
          value={overview ? formatCount(overview.users) : "—"}
          trend={usersTrend.text}
          positive={usersTrend.positive}
        />
        <MetricCard
          label={t("metrics.pageviews")}
          value={overview ? formatCount(overview.pageviews) : "—"}
          trend={viewsTrend.text}
          positive={viewsTrend.positive}
        />
        <MetricCard
          label={t("metrics.newUsers")}
          value={overview ? formatCount(overview.newUsers) : "—"}
          trend={newTrend.text}
          positive={newTrend.positive}
        />
        <MetricCard
          label={t("metrics.viewsPerUser")}
          value={perUser != null ? perUser.toFixed(1) : "—"}
          trend={perUserTrend.text}
          positive={perUserTrend.positive}
        />
        <MetricCard
          label={t("metrics.lastVisit")}
          value={
            overview ? formatLastVisit(overview.lastVisit, locale) : "—"
          }
          trend=""
          className="col-span-2 xl:col-span-1"
        />
      </div>

      {showSetup && setupHref && (
        <div className="rounded-xl border border-primary/25 bg-primary-soft/30 px-4 py-3.5 sm:px-5">
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
      )}

      <TrafficChart series={series} />

      <div className="grid gap-4 lg:grid-cols-2">
        <RankedList
          title={t("tabs.page")}
          tabs={[{ id: "page", label: t("tabs.page") }]}
          datasets={{ page: pages }}
          empty={t("empty")}
          limit={8}
        />
        <RankedList
          title={t("tabs.referrer")}
          tabs={[{ id: "referrer", label: t("tabs.referrer") }]}
          datasets={{ referrer: mappedReferrers }}
          empty={t("empty")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <RankedList
          title={t("tabs.browser")}
          tabs={[{ id: "browser", label: t("tabs.browser") }]}
          datasets={{ browser: browsers }}
          empty={t("empty")}
        />
        <RankedList
          title={t("tabs.os")}
          tabs={[{ id: "os", label: t("tabs.os") }]}
          datasets={{ os: oses }}
          empty={t("empty")}
        />
        <RankedList
          title={t("tabs.userAgent")}
          tabs={[{ id: "userAgent", label: t("tabs.userAgent") }]}
          datasets={{ userAgent: userAgents }}
          empty={t("empty")}
          className="lg:col-span-2 xl:col-span-1"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <TrafficMap className="min-h-[280px]" items={mappedLocations} />
        <RankedList
          className="h-full min-h-[280px]"
          title={t("tabs.country")}
          tabs={[{ id: "country", label: t("tabs.country") }]}
          datasets={{ country: mappedLocations }}
          empty={t("empty")}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useLocale, useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { MetricCard } from "@/components/demo/MetricCard";
import { RankedList } from "@/components/demo/RankedList";
import { TrafficMap } from "@/components/app/TrafficMap";
import { TrafficChart } from "@/components/app/TrafficChart";
import {
  groupByBrowser,
  groupByOs,
  groupByParsedUserAgent,
} from "@/lib/parse-user-agent";
import { countryLabel, flagEmoji } from "@/lib/geo-display";
import { formatCount, type RankedItem } from "@/lib/demo-data";

type PeriodStats = {
  users: number;
  pageviews: number;
  newUsers: number;
};

type Overview = PeriodStats & {
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

export default function TrafficPage() {
  const { activeAppId: appId } = useActiveApp();
  const { data } = useSession();
  const t = useTranslations("demo");
  const locale = useLocale();

  const [overview, setOverview] = useState<Overview | null>(null);
  const [series, setSeries] = useState<
    { date: string; sessions: number; pageviews: number }[]
  >([]);
  const [pages, setPages] = useState<RankedItem[]>([]);
  const [locations, setLocations] = useState<RankedItem[]>([]);
  const [referrers, setReferrers] = useState<RankedItem[]>([]);
  const [uaRaw, setUaRaw] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    if (!data?.apiToken || !appId) return;
    const token = data.apiToken;
    void (async () => {
      const [ov, ts, pg, loc, ref, ua] = await Promise.all([
        apiFetch<Overview>(`/v1/apps/${appId}/overview`, { token }),
        apiFetch<{ series: { date: string; sessions: number; pageviews: number }[] }>(
          `/v1/apps/${appId}/timeseries`,
          { token },
        ),
        apiFetch<{ items: RankedItem[] }>(`/v1/apps/${appId}/pages`, { token }),
        apiFetch<{ items: RankedItem[] }>(`/v1/apps/${appId}/locations`, {
          token,
        }),
        apiFetch<{ items: RankedItem[] }>(`/v1/apps/${appId}/referrers`, {
          token,
        }),
        apiFetch<{ items: { label: string; value: number }[] }>(
          `/v1/apps/${appId}/user-agents`,
          { token },
        ),
      ]);
      setOverview(ov);
      setSeries(ts.series);
      setPages(pg.items);
      setLocations(
        loc.items.map((i) => {
          const code = i.code ?? (i.label.length === 2 ? i.label : undefined);
          return {
            ...i,
            code,
            label: code ? countryLabel(code, locale) : i.label,
            flag: flagEmoji(code),
          };
        }),
      );
      setReferrers(
        ref.items.map((i) => ({
          ...i,
          label: i.label === "(direct)" ? t("tabs.direct") : i.label,
        })),
      );
      setUaRaw(ua.items);
    })().catch(console.error);
  }, [data?.apiToken, appId, locale, t]);

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

  return (
    <>
      <AppHeader title={t("titles.traffic")} />
      <main className="min-h-0 flex-1 space-y-5 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
              overview
                ? formatLastVisit(overview.lastVisit, locale)
                : "—"
            }
            trend=""
          />
        </div>

        <TrafficChart series={series} />

        <div className="grid gap-4 lg:grid-cols-2">
          <RankedList
            title={t("tabs.page")}
            tabs={[{ id: "page", label: t("tabs.page") }]}
            datasets={{ page: pages }}
            empty={t("empty")}
          />
          <RankedList
            title={t("tabs.referrer")}
            tabs={[{ id: "referrer", label: t("tabs.referrer") }]}
            datasets={{ referrer: referrers }}
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
          <TrafficMap className="min-h-[280px]" items={locations} />
          <RankedList
            className="h-full min-h-[280px]"
            title={t("tabs.country")}
            tabs={[{ id: "country", label: t("tabs.country") }]}
            datasets={{ country: locations }}
            empty={t("empty")}
          />
        </div>
      </main>
    </>
  );
}

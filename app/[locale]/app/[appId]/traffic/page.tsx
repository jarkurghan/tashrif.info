"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useTranslations } from "next-intl";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { MetricCard } from "@/components/demo/MetricCard";
import { RankedList } from "@/components/demo/RankedList";
import { WorldMap } from "@/components/demo/WorldMap";

export default function TrafficPage() {
  const { activeAppId: appId } = useActiveApp();
  const { data } = useSession();
  const t = useTranslations("demo");
  const [overview, setOverview] = useState<{
    users: number;
    sessions: number;
    pageviews: number;
  } | null>(null);
  const [series, setSeries] = useState<
    { date: string; sessions: number; pageviews: number }[]
  >([]);
  const [pages, setPages] = useState<
    { label: string; value: number; percent: number }[]
  >([]);
  const [locations, setLocations] = useState<
    { label: string; value: number; percent: number; flag?: string }[]
  >([]);

  useEffect(() => {
    if (!data?.apiToken || !appId) return;
    const token = data.apiToken;
    void (async () => {
      const [ov, ts, pg, loc] = await Promise.all([
        apiFetch<{
          users: number;
          sessions: number;
          pageviews: number;
        }>(`/v1/apps/${appId}/overview`, { token }),
        apiFetch<{ series: { date: string; sessions: number; pageviews: number }[] }>(
          `/v1/apps/${appId}/timeseries`,
          { token },
        ),
        apiFetch<{ items: { label: string; value: number; percent: number }[] }>(
          `/v1/apps/${appId}/pages`,
          { token },
        ),
        apiFetch<{
          items: { label: string; value: number; percent: number }[];
        }>(`/v1/apps/${appId}/locations`, { token }),
      ]);
      setOverview(ov);
      setSeries(ts.series);
      setPages(pg.items);
      setLocations(
        loc.items.map((i) => ({
          ...i,
          flag: i.label.length === 2 ? undefined : undefined,
        })),
      );
    })().catch(console.error);
  }, [data?.apiToken, appId]);

  return (
    <>
      <AppHeader title={t("titles.traffic")} />
      <main className="min-h-0 flex-1 space-y-6 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label={t("metrics.users")}
            value={String(overview?.users ?? "—")}
            trend="—"
          />
          <MetricCard
            label={t("metrics.sessions")}
            value={String(overview?.sessions ?? "—")}
            trend="—"
          />
          <MetricCard
            label={t("metrics.pageviews")}
            value={String(overview?.pageviews ?? "—")}
            trend="—"
          />
        </div>

        <div className="h-80 w-full rounded-xl border border-border bg-card p-4 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="pageviews"
                stroke="var(--chart-2)"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <WorldMap className="min-h-[280px]" />
          <RankedList
            tabs={[{ id: "country", label: t("tabs.country") }]}
            datasets={{ country: locations }}
          />
        </div>

        <RankedList
          tabs={[{ id: "page", label: t("tabs.page") }]}
          datasets={{ page: pages }}
        />
      </main>
    </>
  );
}

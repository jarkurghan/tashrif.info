"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import {
  TrafficDashboard,
  type TrafficOverview,
} from "@/components/app/TrafficDashboard";
import type { RankedItem } from "@/lib/demo-data";
import { useDateRange } from "@/components/app/DateRangeProvider";

export default function TrafficPage() {
  const { activeAppId: appId } = useActiveApp();
  const { data } = useSession();
  const t = useTranslations("demo");
  const { queryString, ready } = useDateRange();

  const [overview, setOverview] = useState<TrafficOverview | null>(null);
  const [series, setSeries] = useState<
    { date: string; sessions: number; pageviews: number }[]
  >([]);
  const [pages, setPages] = useState<RankedItem[]>([]);
  const [locations, setLocations] = useState<RankedItem[]>([]);
  const [referrers, setReferrers] = useState<RankedItem[]>([]);
  const [uaRaw, setUaRaw] = useState<{ label: string; value: number }[]>([]);

  const load = useCallback(() => {
    if (!data?.apiToken || !appId || !ready) return;
    const token = data.apiToken;
    void (async () => {
      const [ov, ts, pg, loc, ref, ua] = await Promise.all([
        apiFetch<TrafficOverview>(`/v1/apps/${appId}/overview?${queryString}`, {
          token,
        }),
        apiFetch<{ series: { date: string; sessions: number; pageviews: number }[] }>(
          `/v1/apps/${appId}/timeseries?${queryString}`,
          { token },
        ),
        apiFetch<{ items: RankedItem[] }>(
          `/v1/apps/${appId}/pages?${queryString}`,
          { token },
        ),
        apiFetch<{ items: RankedItem[] }>(
          `/v1/apps/${appId}/locations?${queryString}`,
          { token },
        ),
        apiFetch<{ items: RankedItem[] }>(
          `/v1/apps/${appId}/referrers?${queryString}`,
          { token },
        ),
        apiFetch<{ items: { label: string; value: number }[] }>(
          `/v1/apps/${appId}/user-agents?${queryString}`,
          { token },
        ),
      ]);
      setOverview(ov);
      setSeries(ts.series);
      setPages(pg.items);
      setLocations(loc.items);
      setReferrers(ref.items);
      setUaRaw(ua.items);
    })().catch(console.error);
  }, [data?.apiToken, appId, queryString, ready]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <AppHeader title={t("titles.traffic")} />
      <main className="min-h-0 flex-1 space-y-5 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <TrafficDashboard
          overview={overview}
          series={series}
          pages={pages}
          locations={locations}
          referrers={referrers}
          uaRaw={uaRaw}
        />
      </main>
    </>
  );
}

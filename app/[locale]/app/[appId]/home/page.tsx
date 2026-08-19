"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useTranslations } from "next-intl";
import { apiFetch, isAbortError } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import {
  HomeDashboard,
  type DashboardOverview,
} from "@/components/app/HomeDashboard";
import type { RankedItem } from "@/lib/demo-data";
import { useDateRange } from "@/components/app/DateRangeProvider";

type DashboardResponse = {
  overview: DashboardOverview;
  series: { date: string; sessions: number; pageviews: number }[];
  referrers: RankedItem[];
  userAgents: RankedItem[];
};

export default function AppHomePage() {
  const { activeAppId: appId } = useActiveApp();
  const { data } = useSession();
  const t = useTranslations("demo");
  const { queryString, ready } = useDateRange();

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [series, setSeries] = useState<DashboardResponse["series"]>([]);
  const [referrers, setReferrers] = useState<RankedItem[]>([]);
  const [uaRaw, setUaRaw] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    if (!data?.apiToken || !appId || !ready) return;
    const token = data.apiToken;
    const ac = new AbortController();
    const { signal } = ac;

    void (async () => {
      try {
        const dash = await apiFetch<DashboardResponse>(
          `/v1/apps/${appId}/dashboard?${queryString}`,
          { token, signal },
        );
        if (signal.aborted) return;
        setOverview(dash.overview);
        setSeries(dash.series);
        setReferrers(dash.referrers);
        setUaRaw(dash.userAgents);
      } catch (err) {
        if (isAbortError(err)) return;
        console.error(err);
      }
    })();

    return () => ac.abort();
  }, [data?.apiToken, appId, queryString, ready]);

  return (
    <>
      <AppHeader title={t("titles.home")} />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:p-6">
        <HomeDashboard
          overview={overview}
          series={series}
          referrers={referrers}
          uaRaw={uaRaw}
          setupHref="/app/domains"
        />
      </main>
    </>
  );
}

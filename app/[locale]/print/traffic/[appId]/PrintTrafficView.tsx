"use client";

import {
  TrafficDashboard,
  type TrafficOverview,
} from "@/components/app/TrafficDashboard";
import type { RankedItem } from "@/lib/demo-data";

export function PrintTrafficView({
  overview,
  series,
  pages,
  locations,
  referrers,
  uaRaw,
}: {
  overview: TrafficOverview;
  series: { date: string; sessions: number; pageviews: number }[];
  pages: RankedItem[];
  locations: RankedItem[];
  referrers: RankedItem[];
  uaRaw: { label: string; value: number }[];
}) {
  return (
    <TrafficDashboard
      overview={overview}
      series={series}
      pages={pages}
      locations={locations}
      referrers={referrers}
      uaRaw={uaRaw}
      print
    />
  );
}

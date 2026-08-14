"use client";

import { useMemo } from "react";
import { TrafficDashboard } from "@/components/app/TrafficDashboard";
import { useDateRange } from "@/components/app/DateRangeProvider";
import {
  countries,
  demoOverview,
  demoSeriesForRange,
  pages,
  referrers,
  userAgents,
} from "@/lib/demo-data";

export function DemoTrafficDashboard() {
  const { range } = useDateRange();
  const series = useMemo(() => demoSeriesForRange(range), [range]);

  return (
    <TrafficDashboard
      overview={demoOverview}
      series={series}
      pages={pages}
      locations={countries}
      referrers={referrers}
      uaRaw={userAgents}
    />
  );
}

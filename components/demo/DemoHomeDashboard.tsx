"use client";

import { useMemo } from "react";
import { HomeDashboard } from "@/components/app/HomeDashboard";
import { useDateRange } from "@/components/app/DateRangeProvider";
import {
  demoOverview,
  demoSeriesForRange,
  referrers,
  userAgents,
} from "@/lib/demo-data";

export function DemoHomeDashboard() {
  const { range } = useDateRange();
  const series = useMemo(() => demoSeriesForRange(range), [range]);

  return (
    <HomeDashboard
      overview={demoOverview}
      series={series}
      referrers={referrers}
      uaRaw={userAgents}
    />
  );
}

import { setRequestLocale } from "next-intl/server";
import { TrafficDashboard } from "@/components/app/TrafficDashboard";
import {
  countries,
  demoOverview,
  pages,
  referrers,
  trafficSeries,
  userAgents,
} from "@/lib/demo-data";

export default async function TrafficPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <TrafficDashboard
      overview={demoOverview}
      series={trafficSeries}
      pages={pages}
      locations={countries}
      referrers={referrers}
      uaRaw={userAgents}
    />
  );
}

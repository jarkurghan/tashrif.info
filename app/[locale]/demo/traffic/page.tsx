import { getTranslations, setRequestLocale } from "next-intl/server";
import { MetricCard } from "@/components/demo/MetricCard";
import { RankedList } from "@/components/demo/RankedList";
import { TrafficMap } from "@/components/app/TrafficMap";
import { TrafficChart } from "@/components/app/TrafficChart";
import {
  countries,
  metrics,
  pages,
  referrers,
  trafficSeries,
  userAgents,
} from "@/lib/demo-data";
import {
  groupByBrowser,
  groupByOs,
  groupByParsedUserAgent,
} from "@/lib/parse-user-agent";

export default async function TrafficPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("demo");

  const series = trafficSeries.map((s) => ({
    date: s.date,
    sessions: s.sessions,
    pageviews: Math.round(s.sessions * 2.2),
  }));

  const parsedUa = groupByParsedUserAgent(userAgents);
  const browsers = groupByBrowser(userAgents);
  const oses = groupByOs(userAgents);
  const refs = referrers.map((r) => ({
    ...r,
    label: r.label === "(direct)" ? t("tabs.direct") : r.label,
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-5">
        {metrics.map((m) => (
          <MetricCard
            key={m.key}
            label={t(`metrics.${m.key}`)}
            value={m.value}
            trend={m.trend}
            positive={m.positive ?? true}
            className={m.key === "lastVisit" ? "col-span-2 xl:col-span-1" : undefined}
          />
        ))}
      </div>

      <TrafficChart series={series} />

      <div className="grid gap-4 lg:grid-cols-2">
        <RankedList
          title={t("tabs.page")}
          tabs={[{ id: "page", label: t("tabs.page") }]}
          datasets={{ page: pages }}
        />
        <RankedList
          title={t("tabs.referrer")}
          tabs={[{ id: "referrer", label: t("tabs.referrer") }]}
          datasets={{ referrer: refs }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <RankedList
          title={t("tabs.browser")}
          tabs={[{ id: "browser", label: t("tabs.browser") }]}
          datasets={{ browser: browsers }}
        />
        <RankedList
          title={t("tabs.os")}
          tabs={[{ id: "os", label: t("tabs.os") }]}
          datasets={{ os: oses }}
        />
        <RankedList
          title={t("tabs.userAgent")}
          tabs={[{ id: "userAgent", label: t("tabs.userAgent") }]}
          datasets={{ userAgent: parsedUa }}
          className="lg:col-span-2 xl:col-span-1"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <TrafficMap className="min-h-[320px]" items={countries} />
        <RankedList
          className="h-full min-h-[320px]"
          title={t("tabs.country")}
          tabs={[{ id: "country", label: t("tabs.country") }]}
          datasets={{ country: countries }}
        />
      </div>
    </div>
  );
}

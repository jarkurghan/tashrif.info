import { getTranslations, setRequestLocale } from "next-intl/server";
import { MetricCard } from "@/components/demo/MetricCard";
import { SessionsChart } from "@/components/demo/SessionsChart";
import { RankedList } from "@/components/demo/RankedList";
import { WorldMap } from "@/components/demo/WorldMap";
import {
  cities,
  countries,
  entryPages,
  exitPages,
  metrics,
  pages,
  regions,
} from "@/lib/demo-data";

export default async function TrafficPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("demo");

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((m) => (
          <MetricCard
            key={m.key}
            label={t(`metrics.${m.key}`)}
            value={m.value}
            trend={m.trend}
            positive={m.positive ?? true}
          />
        ))}
      </div>

      <SessionsChart />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <WorldMap className="min-h-[320px]" />
        <RankedList
          tabs={[
            { id: "country", label: t("tabs.country") },
            { id: "region", label: t("tabs.region") },
            { id: "city", label: t("tabs.city") },
          ]}
          datasets={{
            country: countries,
            region: regions,
            city: cities,
          }}
        />
      </div>

      <RankedList
        tabs={[
          { id: "page", label: t("tabs.page") },
          { id: "entry", label: t("tabs.entry") },
          { id: "exit", label: t("tabs.exit") },
        ]}
        datasets={{
          page: pages,
          entry: entryPages,
          exit: exitPages,
        }}
      />
    </div>
  );
}

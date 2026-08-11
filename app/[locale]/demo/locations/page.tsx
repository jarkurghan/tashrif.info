import { getTranslations, setRequestLocale } from "next-intl/server";
import { RankedList } from "@/components/demo/RankedList";
import { WorldMap } from "@/components/demo/WorldMap";
import { cities, countries, regions } from "@/lib/demo-data";

export default async function LocationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("demo");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <WorldMap className="min-h-[360px]" />
      <RankedList
        detailsLabel={t("details")}
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
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { RankedList } from "@/components/demo/RankedList";
import { WorldMap } from "@/components/demo/WorldMap";

export default function LocationsAnalyticsPage() {
  const { appId } = useParams<{ appId: string }>();
  const { data } = useSession();
  const t = useTranslations("demo");
  const [items, setItems] = useState<
    { label: string; value: number; percent: number }[]
  >([]);

  useEffect(() => {
    if (!data?.apiToken || !appId) return;
    apiFetch<{ items: typeof items }>(`/v1/apps/${appId}/locations`, {
      token: data.apiToken,
    })
      .then((r) => setItems(r.items))
      .catch(console.error);
  }, [data?.apiToken, appId]);

  return (
    <>
      <AppHeader title={t("titles.locations")} appId={appId} />
      <main className="grid flex-1 gap-4 p-4 sm:p-6 lg:grid-cols-2">
        <WorldMap className="min-h-[320px]" />
        <RankedList
          detailsLabel={t("details")}
          tabs={[{ id: "country", label: t("tabs.country") }]}
          datasets={{ country: items }}
        />
      </main>
    </>
  );
}

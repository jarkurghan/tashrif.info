"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { RankedList } from "@/components/demo/RankedList";

export default function PagesAnalyticsPage() {
  const { appId } = useParams<{ appId: string }>();
  const { data } = useSession();
  const t = useTranslations("demo");
  const [items, setItems] = useState<
    { label: string; value: number; percent: number }[]
  >([]);

  useEffect(() => {
    if (!data?.apiToken || !appId) return;
    apiFetch<{ items: typeof items }>(`/v1/apps/${appId}/pages`, {
      token: data.apiToken,
    })
      .then((r) => setItems(r.items))
      .catch(console.error);
  }, [data?.apiToken, appId]);

  return (
    <>
      <AppHeader title={t("titles.pages")} appId={appId} />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <RankedList
            detailsLabel={t("details")}
            tabs={[{ id: "page", label: t("tabs.page") }]}
            datasets={{ page: items }}
          />
        </div>
      </main>
    </>
  );
}

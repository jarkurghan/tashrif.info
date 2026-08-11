"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AppHeader } from "@/components/app/AppHeader";
import { EventsChart } from "@/components/demo/EventsChart";

export default function EventsAnalyticsPage() {
  const { appId } = useParams<{ appId: string }>();
  const t = useTranslations("demo");

  return (
    <>
      <AppHeader title={t("titles.events")} appId={appId} />
      <main className="flex-1 space-y-4 p-4 sm:p-6">
        <p className="text-sm text-muted-foreground">
          Custom events chart (demo visualization until events are tracked via API).
        </p>
        <EventsChart />
      </main>
    </>
  );
}

import { setRequestLocale } from "next-intl/server";
import { EventsChart } from "@/components/demo/EventsChart";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <EventsChart />;
}

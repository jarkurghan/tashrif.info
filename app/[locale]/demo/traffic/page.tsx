import { setRequestLocale } from "next-intl/server";
import { DemoTrafficDashboard } from "@/components/demo/DemoTrafficDashboard";

export default async function TrafficPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DemoTrafficDashboard />;
}

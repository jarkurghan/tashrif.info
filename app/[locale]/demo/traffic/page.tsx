import { setRequestLocale } from "next-intl/server";
import { DemoTrafficDashboard } from "@/components/demo/DemoTrafficDashboard";
import { demoMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return demoMetadata(locale, "traffic");
}

export default async function TrafficPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DemoTrafficDashboard />;
}

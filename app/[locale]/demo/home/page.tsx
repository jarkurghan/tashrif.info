import { setRequestLocale } from "next-intl/server";
import { demoMetadata } from "@/lib/seo";
import { DemoHomeDashboard } from "@/components/demo/DemoHomeDashboard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return demoMetadata(locale, "home");
}

export default async function DemoHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DemoHomeDashboard />;
}

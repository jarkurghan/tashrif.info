import { setRequestLocale } from "next-intl/server";
import { LogsTable } from "@/components/demo/LogsTable";
import { demoMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return demoMetadata(locale, "logs");
}

export default async function LogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LogsTable />;
}

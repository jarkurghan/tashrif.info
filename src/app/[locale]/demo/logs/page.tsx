import { setRequestLocale } from "next-intl/server";
import { LogsTable } from "@/components/demo/LogsTable";

export default async function LogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LogsTable />;
}

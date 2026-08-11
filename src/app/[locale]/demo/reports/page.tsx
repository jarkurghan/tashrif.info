import { setRequestLocale } from "next-intl/server";
import { ReportsForm } from "@/components/demo/ReportsForm";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ReportsForm />;
}

import { redirect } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function AppIdIndexPage({
  params,
}: {
  params: Promise<{ locale: string; appId: string }>;
}) {
  const { locale, appId } = await params;
  setRequestLocale(locale);
  redirect({ href: `/app/${appId}/home`, locale });
}

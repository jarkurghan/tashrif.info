import { setRequestLocale } from "next-intl/server";

export default async function AppIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; appId: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}

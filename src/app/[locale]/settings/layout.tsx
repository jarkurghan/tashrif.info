import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.apiToken) redirect({ href: "/login", locale });
  return children;
}

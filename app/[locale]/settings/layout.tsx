import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { AppShell } from "@/components/app/AppShell";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

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
  if (!session?.user) redirect({ href: "/login", locale });
  if (!session?.apiToken) redirect({ href: "/login?error=sync", locale });
  return <AppShell>{children}</AppShell>;
}

import { setRequestLocale } from "next-intl/server";
import { ActiveAppGuard } from "@/components/app/ActiveAppGuard";

export default async function AppIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; appId: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ActiveAppGuard>{children}</ActiveAppGuard>;
}

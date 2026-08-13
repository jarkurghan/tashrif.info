"use client";

import { useEffect } from "react";
import { hasLocale, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LocaleSync() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    const preferred = session?.locale;
    if (!preferred || !hasLocale(routing.locales, preferred)) return;
    if (preferred === locale) return;
    router.replace(pathname, { locale: preferred as Locale });
  }, [status, session?.locale, locale, pathname, router]);

  return null;
}

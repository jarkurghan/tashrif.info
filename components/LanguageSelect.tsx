"use client";

import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { apiFetch } from "@/lib/api";

export function LanguageSelect({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, update } = useSession();

  return (
    <Select
      aria-label="Language"
      size="sm"
      align="end"
      className={cn("w-auto min-w-[4.5rem]", className)}
      triggerClassName="bg-card"
      value={locale}
      onChange={(next) => {
        const nextLocale = next as Locale;
        void (async () => {
          try {
            if (session?.apiToken) {
              await apiFetch("/v1/auth/me", {
                method: "PATCH",
                token: session.apiToken,
                body: JSON.stringify({ locale: nextLocale }),
              });
              await update({ locale: nextLocale });
            }
            router.replace(pathname, { locale: nextLocale });
          } catch (e) {
            console.error(e);
          }
        })();
      }}
      options={routing.locales.map((l) => ({
        value: l,
        label: l.toUpperCase(),
      }))}
    />
  );
}

"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";

export function LanguageSelect({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Select
      aria-label="Language"
      size="sm"
      align="end"
      className={cn("w-auto min-w-[4.5rem]", className)}
      triggerClassName="bg-card"
      value={locale}
      onChange={(next) => {
        router.replace(pathname, { locale: next as Locale });
      }}
      options={routing.locales.map((l) => ({
        value: l,
        label: l.toUpperCase(),
      }))}
    />
  );
}

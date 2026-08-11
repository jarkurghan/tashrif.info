"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LanguageSelect({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <select
      aria-label="Language"
      className={cn(
        "rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/40",
        className,
      )}
      value={locale}
      onChange={(e) => {
        router.replace(pathname, { locale: e.target.value as Locale });
      }}
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}

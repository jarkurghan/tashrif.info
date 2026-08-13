"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSelect } from "@/components/LanguageSelect";
import { Activity } from "lucide-react";

export function MarketingNav() {
  const t = useTranslations("nav");
  const { status } = useSession();

  return (
    <header className="relative z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </span>
          <span className="text-lg">tashrif.info</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelect />
          {status === "authenticated" ? (
            <Link
              href="/app"
              className="inline-flex rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
            >
              {t("dashboard")}
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {t("login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

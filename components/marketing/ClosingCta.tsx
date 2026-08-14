import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export function ClosingCta() {
  const t = useTranslations("closing");

  return (
    <section className="border-t border-border/70 py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border bg-card px-5 py-8 text-center shadow-sm sm:px-10 sm:py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("title")}</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground sm:mt-3 sm:text-base">{t("sub")}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
            >
              {t("ctaDemo")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              {t("ctaAdd")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

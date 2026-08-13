import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export function ClosingCta() {
  const t = useTranslations("closing");

  return (
    <section className="border-t border-border/70 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16">
          <h2 className="text-3xl font-semibold tracking-tight">{t("title")}</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">{t("sub")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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

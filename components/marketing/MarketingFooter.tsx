import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Activity } from "lucide-react";
import { LanguageSelect } from "@/components/LanguageSelect";

export function MarketingFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="h-4 w-4" />
            </span>
            tashrif.info
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t("tagline")}
          </p>
          <div className="mt-4">
            <LanguageSelect />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">{t("product")}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/demo" className="hover:text-foreground">
                {nav("demo")}
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-foreground">
                {nav("addDomain")}
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-foreground">
                {nav("login")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">{t("features")}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/demo/traffic" className="hover:text-foreground">
                {nav("traffic")}
              </Link>
            </li>
            <li>
              <Link href="/demo/reports" className="hover:text-foreground">
                {nav("reports")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} tashrif.info
      </div>
    </footer>
  );
}

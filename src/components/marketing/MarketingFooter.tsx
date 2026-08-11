import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Activity } from "lucide-react";
import { LanguageSelect } from "@/components/LanguageSelect";

export function MarketingFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="h-4 w-4" />
            </span>
            tashrif.info
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Modern website analytics for teams who care about clarity.
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
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">{t("company")}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                {nav("home")}
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
          <p className="text-sm font-semibold">{t("legal")}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{t("privacy")}</li>
            <li>{t("terms")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} tashrif.info. {t("rights")}
      </div>
    </footer>
  );
}

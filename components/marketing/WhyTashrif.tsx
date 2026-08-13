import { useTranslations } from "next-intl";
import { Code2, Send, Languages, Shield } from "lucide-react";

export function WhyTashrif() {
  const t = useTranslations("why");

  const items = [
    { icon: Code2, title: t("sdkTitle"), desc: t("sdkDesc") },
    { icon: Send, title: t("telegramTitle"), desc: t("telegramDesc") },
    { icon: Languages, title: t("localeTitle"), desc: t("localeDesc") },
    { icon: Shield, title: t("teamTitle"), desc: t("teamDesc") },
  ];

  return (
    <section className="border-t border-border/70 bg-card/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight">{t("title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("sub")}</p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.title}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { useTranslations } from "next-intl";
import { Package, KeyRound, Radio } from "lucide-react";

const icons = [Package, KeyRound, Radio];

export function FeatureSteps() {
  const t = useTranslations("steps");
  const items = [
    { title: t("one.title"), desc: t("one.desc") },
    { title: t("two.title"), desc: t("two.desc") },
    { title: t("three.title"), desc: t("three.desc") },
  ];

  return (
    <section className="border-t border-border/70 bg-card/40 py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("title")}</h2>
          <p className="mt-1.5 text-muted-foreground sm:mt-2">{t("sub")}</p>
        </div>
        <ol className="mt-6 grid gap-5 sm:mt-10 sm:gap-6 md:mt-12 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i];
            return (
              <li key={item.title} className="relative">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary sm:mb-4 sm:h-11 sm:w-11">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  0{i + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

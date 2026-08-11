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
    <section className="border-t border-border/70 bg-card/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight">{t("title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("sub")}</p>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i];
            return (
              <li key={item.title} className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
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

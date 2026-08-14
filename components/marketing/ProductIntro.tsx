import { useTranslations } from "next-intl";
import { LayoutDashboard, Send, Users } from "lucide-react";

export function ProductIntro() {
  const t = useTranslations("intro");

  const cards = [
    { icon: LayoutDashboard, title: t("boardTitle"), desc: t("boardDesc") },
    { icon: Send, title: t("reportsTitle"), desc: t("reportsDesc") },
    { icon: Users, title: t("teamTitle"), desc: t("teamDesc") },
  ];

  return (
    <section className="border-t border-border/70 py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div>
          <p className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {t("badge")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-[2rem] sm:leading-tight">
            {t("title")}
          </h2>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-[17px]">
            {t("body")}
          </p>
        </div>

        <ul className="mt-6 grid gap-3 sm:mt-10 sm:gap-4 md:mt-12 md:grid-cols-3">
          {cards.map((card) => (
            <li
              key={card.title}
              className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary sm:mb-4 sm:h-11 sm:w-11">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {card.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

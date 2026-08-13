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
    <section className="border-t border-border/70 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div>
          <p className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {t("badge")}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-[2rem] sm:leading-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-[17px]">
            {t("body")}
          </p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <li
              key={card.title}
              className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
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

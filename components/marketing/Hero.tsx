import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 20%, var(--hero-glow), transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 10%, var(--hero-glow-2), transparent 55%)
          `,
        }}
      />
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:pb-24 lg:pt-20">
        <div>
          <p className="animate-fade-up text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            {t("brand")}
          </p>
          <h1 className="animate-fade-up-delay mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {t("headline")}
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("sub")}
          </p>
          <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
            >
              {t("ctaDemo")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              {t("ctaAdd")}
            </Link>
          </div>
        </div>

        <div className="animate-float relative min-h-[280px] lg:min-h-[340px]">
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-card/90 p-4 shadow-[0_24px_80px_-32px_rgba(13,148,136,0.45)] backdrop-blur">
      <div className="mb-4 flex items-center justify-end">
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
          Last 24 hours
        </span>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          ["Users", "10.6k"],
          ["Sessions", "11.4k"],
          ["Views", "26.8k"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-muted/70 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="text-lg font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 320 120" className="h-28 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 90 C40 80, 60 40, 90 55 C120 70, 140 30, 170 35 C200 40, 220 70, 250 50 C280 30, 300 45, 320 25 L320 120 L0 120 Z"
          fill="url(#area)"
        />
        <path
          d="M0 90 C40 80, 60 40, 90 55 C120 70, 140 30, 170 35 C200 40, 220 70, 250 50 C280 30, 300 45, 320 25"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
        />
        <path
          d="M0 100 C50 95, 80 70, 110 75 C150 82, 180 60, 210 65 C250 72, 280 55, 320 48"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.85"
        />
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ["🇺🇿 Uzbekistan", "1.8k"],
          ["🇺🇸 United States", "3.4k"],
          ["🇩🇪 Germany", "794"],
          ["🇬🇧 United Kingdom", "776"],
        ].map(([name, count]) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-md bg-muted/50 px-2.5 py-1.5 text-xs"
          >
            <span className="truncate text-muted-foreground">{name}</span>
            <span className="font-medium tabular-nums">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

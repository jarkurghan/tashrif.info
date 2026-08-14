"use client";

import { useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { landingSparkline } from "@/lib/demo-data";
import { Users, Waypoints, Globe2, FileText } from "lucide-react";

export function MetricsPreview() {
  const t = useTranslations("metricsSection");
  const p = useTranslations("preview");

  const cards = [
    { icon: Users, label: t("visitors"), value: "10.6k" },
    { icon: Waypoints, label: t("sessions"), value: "11.4k" },
    { icon: Globe2, label: t("countries"), value: "64" },
    { icon: FileText, label: t("pages"), value: "128" },
  ];

  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("title")}</h2>
          <p className="mt-1.5 text-muted-foreground sm:mt-2">{t("sub")}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-border bg-card p-3.5 shadow-sm sm:p-5"
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary sm:mb-3 sm:h-9 sm:w-9">
                <c.icon className="h-4 w-4" />
              </div>
              <p className="text-xs text-muted-foreground sm:text-sm">{c.label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums sm:text-2xl">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-14">
          <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{p("title")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{p("sub")}</p>
          <div className="mt-4 h-44 rounded-xl border border-border bg-card p-3 shadow-sm sm:mt-6 sm:h-56 sm:p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={landingSparkline}>
                <defs>
                  <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="t"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--primary)"
                  fill="url(#spark)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

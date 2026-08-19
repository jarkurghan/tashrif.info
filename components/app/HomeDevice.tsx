"use client";

import { useTranslations } from "next-intl";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { formatCount, type RankedItem } from "@/lib/demo-data";

const ICONS = {
  Desktop: Monitor,
  Mobile: Smartphone,
  Tablet: Tablet,
} as const;

const COLORS = {
  Desktop: "var(--chart-1)",
  Mobile: "var(--chart-2)",
  Tablet: "var(--chart-3)",
} as const;

export function HomeDevice({
  title,
  items,
  empty,
}: {
  title: string;
  items: RankedItem[];
  empty: string;
}) {
  const th = useTranslations("demo.home");
  const labels = {
    Desktop: th("desktop"),
    Mobile: th("mobile"),
    Tablet: th("tablet"),
  } as const;
  const byLabel = new Map(items.map((i) => [i.label, i]));
  const rows = (["Desktop", "Mobile", "Tablet"] as const).map((label) => {
    const hit = byLabel.get(label);
    return {
      label,
      value: hit?.value ?? 0,
      percent: hit?.percent ?? 0,
    };
  });
  const has = rows.some((r) => r.value > 0);

  return (
    <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      {!has ? (
        <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <div className="mt-4 grid flex-1 grid-cols-3 gap-3">
          {rows.map((row) => {
            const Icon = ICONS[row.label];
            const color = COLORS[row.label];
            const r = 22;
            const c = 2 * Math.PI * r;
            const pct = Math.min(100, Math.max(0, row.percent));
            return (
              <div
                key={row.label}
                className="flex flex-col items-center justify-center rounded-xl bg-muted/50 px-2 py-4"
              >
                <Icon className="mb-2 h-4 w-4 text-muted-foreground" />
                <svg viewBox="0 0 56 56" className="h-[4.5rem] w-[4.5rem]">
                  <circle
                    cx="28"
                    cy="28"
                    r={r}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(pct / 100) * c} ${c}`}
                    transform="rotate(-90 28 28)"
                  />
                  <text
                    x="28"
                    y="30"
                    textAnchor="middle"
                    className="fill-foreground text-[11px] font-semibold"
                  >
                    {pct}%
                  </text>
                </svg>
                <p className="mt-2 text-xs font-medium">{labels[row.label]}</p>
                <p className="tabular-nums text-[11px] text-muted-foreground">
                  {formatCount(row.value)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import type { ReactNode } from "react";

export function HomeGauge({
  title,
  hint,
  value,
  label,
  trend,
}: {
  title: string;
  hint: string;
  value: number;
  label: string;
  trend?: ReactNode;
}) {
  const pct = Math.min(100, Math.max(0, value * 100));
  const r = 54;
  const c = 2 * Math.PI * r;
  const arc = 0.75 * c;
  const filled = (pct / 100) * arc;

  return (
    <div className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {trend}
      </div>
      <div className="relative mx-auto mt-2 flex w-full max-w-[220px] flex-1 items-center justify-center">
        <svg viewBox="0 0 140 140" className="h-full w-full max-h-[200px]">
          <g transform="rotate(135 70 70)">
            <circle
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke="var(--muted)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${arc} ${c}`}
            />
            <circle
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke="var(--chart-1)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${c}`}
            />
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <p className="text-3xl font-semibold tabular-nums tracking-tight">{label}</p>
        </div>
      </div>
      <p className="mt-1 text-center text-xs leading-relaxed text-muted-foreground">
        {hint}
      </p>
    </div>
  );
}

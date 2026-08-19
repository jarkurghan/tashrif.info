"use client";

import { formatCount } from "@/lib/demo-data";

type Step = { label: string; value: number };

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

export function HomeFunnel({
  title,
  steps,
  empty,
}: {
  title: string;
  steps: Step[];
  empty: string;
}) {
  const max = Math.max(1, ...steps.map((s) => s.value));
  const has = steps.some((s) => s.value > 0);
  const cx = 80;
  const cy = 80;

  return (
    <div className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="pointer-events-none absolute -left-12 top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <h3 className="relative text-sm font-semibold tracking-tight">{title}</h3>
      {!has ? (
        <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <div className="relative mt-2 flex min-h-0 flex-1 flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="mx-auto h-44 w-44 shrink-0">
            <svg viewBox="0 0 160 160" className="h-full w-full text-foreground">
              {steps.map((step, i) => {
                const r = 64 - i * 16;
                const c = 2 * Math.PI * r;
                const pct = step.value / max;
                return (
                  <g key={step.label}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="11"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill="none"
                      stroke={COLORS[i]!}
                      strokeWidth="11"
                      strokeLinecap="round"
                      strokeDasharray={`${pct * c} ${c}`}
                      transform={`rotate(-90 ${cx} ${cy})`}
                    />
                  </g>
                );
              })}
              <text
                x={cx}
                y={cy + 6}
                textAnchor="middle"
                fill="currentColor"
                className="text-2xl font-semibold"
              >
                {formatCount(Math.max(...steps.map((s) => s.value)))}
              </text>
            </svg>
          </div>
          <ul className="min-w-0 flex-1 space-y-3">
            {steps.map((step, i) => (
              <li key={step.label}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: COLORS[i] }}
                    />
                    <span className="truncate">{step.label}</span>
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatCount(step.value)}
                  </span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(step.value / max) * 100}%`,
                      background: COLORS[i],
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

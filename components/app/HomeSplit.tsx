"use client";

import { formatCount } from "@/lib/demo-data";

export function HomeSplit({
  title,
  leftLabel,
  rightLabel,
  left,
  right,
  empty,
}: {
  title: string;
  leftLabel: string;
  rightLabel: string;
  left: number;
  right: number;
  empty: string;
}) {
  const total = left + right;
  const lp = total > 0 ? (left / total) * 100 : 0;
  const rp = total > 0 ? (right / total) * 100 : 0;

  return (
    <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      {total <= 0 ? (
        <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <div className="mt-5 flex min-h-0 flex-1 flex-col justify-center gap-6">
          <div className="flex h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-chart-1" style={{ width: `${lp}%` }} />
            <div className="h-full bg-chart-2" style={{ width: `${rp}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-primary-soft/50 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {leftLabel}
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">
                {formatCount(left)}
              </p>
              <p className="mt-1 text-sm font-medium tabular-nums text-primary">
                {Math.round(lp)}%
              </p>
            </div>
            <div className="rounded-xl bg-accent-soft/70 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {rightLabel}
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">
                {formatCount(right)}
              </p>
              <p className="mt-1 text-sm font-medium tabular-nums text-accent">
                {Math.round(rp)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

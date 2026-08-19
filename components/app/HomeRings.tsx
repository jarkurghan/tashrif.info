"use client";

import { formatCount, type RankedItem } from "@/lib/demo-data";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

export function HomeRings({
  title,
  items,
  empty,
}: {
  title: string;
  items: RankedItem[];
  empty: string;
}) {
  const ranked = items.filter((i) => i.value > 0);
  const top = ranked.slice(0, 4);

  return (
    <div className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      {top.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {top.map((item, i) => {
              const pct = Math.min(100, Math.max(0, item.percent));
              const r = 18;
              const c = 2 * Math.PI * r;
              const color = COLORS[i % COLORS.length];
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center"
                >
                  <svg viewBox="0 0 44 44" className="h-16 w-16">
                    <circle
                      cx="22"
                      cy="22"
                      r={r}
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="5"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r={r}
                      fill="none"
                      stroke={color}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${(pct / 100) * c} ${c}`}
                      transform="rotate(-90 22 22)"
                    />
                    <text
                      x="22"
                      y="24"
                      textAnchor="middle"
                      className="fill-foreground text-[9px] font-semibold"
                    >
                      {pct}%
                    </text>
                  </svg>
                  <p
                    className="mt-1.5 w-full truncate text-xs font-medium"
                    title={item.label}
                  >
                    {item.label}
                  </p>
                  <p className="tabular-nums text-[11px] text-muted-foreground">
                    {formatCount(item.value)}
                  </p>
                </div>
              );
            })}
          </div>
          <ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto border-t border-border pt-3">
            {top.map((item, i) => (
              <li key={item.label}>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatCount(item.value)}
                  </span>
                  <span className="w-8 text-right tabular-nums">{item.percent}%</span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, item.percent)}%`,
                      background: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

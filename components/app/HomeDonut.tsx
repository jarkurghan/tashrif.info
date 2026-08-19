"use client";

import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCount, type RankedItem } from "@/lib/demo-data";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function HomeDonut({
  title,
  items,
  empty,
  centerLabel,
}: {
  title: string;
  items: RankedItem[];
  empty: string;
  centerLabel?: string;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const data = useMemo(
    () => items.filter((i) => i.value > 0).slice(0, 5),
    [items],
  );
  const total = data.reduce((s, i) => s + i.value, 0);

  return (
    <div className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      {data.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <>
          <div className="relative mx-auto mt-1 h-44 w-44">
            {ready ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="label"
                    innerRadius="68%"
                    outerRadius="92%"
                    paddingAngle={3}
                    stroke="none"
                    cornerRadius={6}
                  >
                    {data.map((item, i) => (
                      <Cell key={item.label} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCount(Number(value ?? 0))}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      color: "var(--foreground)",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-lg font-semibold tabular-nums">
                {formatCount(total)}
              </p>
              {centerLabel ? (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {centerLabel}
                </p>
              ) : null}
            </div>
          </div>
          <ul className="mt-2 space-y-2">
            {data.map((item, i) => (
              <li key={item.label} className="flex items-center gap-2.5 text-xs">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="min-w-0 flex-1 truncate font-medium">
                  {item.label}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {formatCount(item.value)}
                </span>
                <span className="w-9 text-right tabular-nums font-medium">
                  {item.percent}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

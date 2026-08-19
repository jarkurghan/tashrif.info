"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatTick(v: string) {
  const s = String(v);
  const hour = s.match(/(\d{2}):00$/);
  if (hour) return `${hour[1]}h`;
  const day = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (day) return `${day[3]}.${day[2]}`;
  return s.slice(5, 10);
}

export function HomeIntensity({
  title,
  hint,
  series,
  empty,
}: {
  title: string;
  hint: string;
  series: { date: string; sessions: number; pageviews: number }[];
  empty: string;
}) {
  const gid = useId().replace(/:/g, "");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const data = useMemo(
    () =>
      series.map((p) => ({
        date: p.date,
        depth: p.sessions > 0 ? Math.round((p.pageviews / p.sessions) * 10) / 10 : 0,
      })),
    [series],
  );
  const has = data.some((d) => d.depth > 0);

  return (
    <div className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="pointer-events-none absolute -bottom-10 -right-8 h-36 w-36 rounded-full bg-chart-3/15 blur-3xl" />
      <h3 className="relative text-sm font-semibold tracking-tight">{title}</h3>
      <p className="relative mt-0.5 text-xs text-muted-foreground">{hint}</p>
      {!has ? (
        <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <div className="relative mt-3 min-h-0 flex-1">
          {ready ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`dp-${gid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="4 8"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickFormatter={formatTick}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  width={28}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  formatter={(value) => [Number(value ?? 0).toFixed(1), title]}
                  labelFormatter={(v) => formatTick(String(v))}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--foreground)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="depth"
                  stroke="var(--chart-3)"
                  fill={`url(#dp-${gid})`}
                  strokeWidth={2.5}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      )}
    </div>
  );
}

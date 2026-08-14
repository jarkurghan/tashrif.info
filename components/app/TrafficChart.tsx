"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslations } from "next-intl";

function formatTick(v: string) {
  const s = String(v);
  const hour = s.match(/(\d{2}):00$/);
  if (hour) return `${hour[1]}h`;
  const day = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (day) return `${day[3]}.${day[2]}`;
  return s.slice(5, 10);
}

function formatTooltipLabel(v: string) {
  const s = String(v);
  const hour = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):00$/);
  if (hour) return `${hour[3]}.${hour[2]}.${hour[1]} ${hour[4]}:00`;
  const day = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (day) return `${day[3]}.${day[2]}.${day[1]}`;
  return s;
}

const TARGET_POINTS = 24;

function downsample(
  points: { date: string; sessions: number; pageviews: number }[],
) {
  if (points.length <= TARGET_POINTS + 2) return points;
  const step = Math.ceil(points.length / TARGET_POINTS);
  const out: { date: string; sessions: number; pageviews: number }[] = [];
  for (let i = 0; i < points.length; i += step) {
    const chunk = points.slice(i, i + step);
    out.push({
      date: chunk[0].date,
      sessions: chunk.reduce((s, p) => s + p.sessions, 0),
      pageviews: chunk.reduce((s, p) => s + p.pageviews, 0),
    });
  }
  return out;
}

export function TrafficChart({
  series,
}: {
  series: { date: string; sessions: number; pageviews: number }[];
}) {
  const t = useTranslations("demo.charts");
  const [compact, setCompact] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setCompact(mq.matches);
    apply();
    setReady(true);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const data = useMemo(() => downsample(series), [series]);

  return (
    <div
      className={
        compact
          ? "h-64 w-full rounded-xl border border-border bg-card p-3 shadow-sm"
          : "h-72 w-full rounded-xl border border-border bg-card p-4 shadow-sm sm:h-80"
      }
    >
      {ready ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: compact ? 4 : 8, right: compact ? 4 : 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: compact ? 10 : 11, fill: "var(--muted-foreground)" }}
              tickFormatter={formatTick}
              interval="preserveStartEnd"
              minTickGap={compact ? 18 : 28}
            />
            <YAxis
              width={compact ? 28 : 40}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: compact ? 10 : 12, fill: "var(--muted-foreground)" }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.35 }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                color: "var(--foreground)",
                fontSize: compact ? 12 : 13,
              }}
              labelFormatter={(v) => formatTooltipLabel(String(v))}
            />
            <Legend
              wrapperStyle={{
                paddingTop: compact ? 6 : 10,
                fontSize: compact ? 12 : 13,
              }}
              iconSize={compact ? 10 : 14}
              formatter={(value) =>
                value === "sessions" ? t("sessions") : t("pageviews")
              }
            />
            <Area
              type="monotone"
              dataKey="pageviews"
              name="pageviews"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.22}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="sessions"
              name="sessions"
              stroke="var(--chart-2)"
              fill="var(--chart-2)"
              fillOpacity={0.28}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}

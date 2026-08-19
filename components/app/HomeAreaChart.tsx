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
import { useTranslations } from "next-intl";
import { formatCount } from "@/lib/demo-data";

function formatTick(v: string) {
  const s = String(v);
  const hour = s.match(/(\d{2}):00$/);
  if (hour) return `${hour[1]}h`;
  const day = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (day) return `${day[3]}.${day[2]}`;
  return s.slice(5, 10);
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
      date: chunk[0]!.date,
      sessions: chunk.reduce((s, p) => s + p.sessions, 0),
      pageviews: chunk.reduce((s, p) => s + p.pageviews, 0),
    });
  }
  return out;
}

function formatTooltipLabel(v: string) {
  const s = String(v);
  const hour = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):00$/);
  if (hour) return `${hour[3]}.${hour[2]}.${hour[1]} ${hour[4]}:00`;
  const day = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (day) return `${day[3]}.${day[2]}.${day[1]}`;
  return s;
}

export function HomeAreaChart({
  title,
  series,
}: {
  title: string;
  series: { date: string; sessions: number; pageviews: number }[];
}) {
  const t = useTranslations("demo.charts");
  const th = useTranslations("demo.home");
  const gid = useId().replace(/:/g, "");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const data = useMemo(() => downsample(series), [series]);
  const peak = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((best, p) => (p.pageviews > best.pageviews ? p : best));
  }, [data]);

  return (
    <div className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{th("trafficHint")}</p>
        </div>
        {peak && peak.pageviews > 0 ? (
          <div className="rounded-lg bg-primary-soft/70 px-2.5 py-1.5 text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-primary">
              {th("peak")}
            </p>
            <p className="text-sm font-semibold tabular-nums text-foreground">
              {formatCount(peak.pageviews)}
            </p>
          </div>
        ) : null}
      </div>
      <div className="relative min-h-0 flex-1">
        {ready ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`pv-${gid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.38} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id={`ss-${gid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.02} />
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
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickFormatter={formatTick}
                interval="preserveStartEnd"
                minTickGap={28}
              />
              <YAxis
                width={36}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "4 4" }}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  color: "var(--foreground)",
                  fontSize: 12,
                  boxShadow: "0 12px 32px rgba(15,28,26,0.08)",
                }}
                labelFormatter={(v) => formatTooltipLabel(String(v))}
                formatter={(value, name) => [
                  formatCount(Number(value ?? 0)),
                  name === "sessions" ? t("sessions") : t("pageviews"),
                ]}
              />
              <Area
                type="monotone"
                dataKey="pageviews"
                name="pageviews"
                stroke="var(--chart-1)"
                fill={`url(#pv-${gid})`}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)" }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                name="sessions"
                stroke="var(--chart-2)"
                fill={`url(#ss-${gid})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : null}
      </div>
      <div className="relative mt-2 flex gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-chart-1" />
          {t("pageviews")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-chart-2" />
          {t("sessions")}
        </span>
      </div>
    </div>
  );
}

"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { trafficSeries } from "@/lib/demo-data";
import { useTranslations } from "next-intl";

export function SessionsChart() {
  const t = useTranslations("demo.charts");

  return (
    <div className="h-80 w-full rounded-xl border border-border bg-card p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trafficSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(v) => `${v}m`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--foreground)",
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 12, fontSize: 13 }}
            formatter={(value) =>
              value === "sessions" ? t("sessions") : t("duration")
            }
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sessions"
            name="sessions"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="durationMin"
            name="durationMin"
            stroke="var(--chart-2)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

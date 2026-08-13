"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslations } from "next-intl";

export function TrafficChart({
  series,
}: {
  series: { date: string; sessions: number; pageviews: number }[];
}) {
  const t = useTranslations("demo.charts");

  return (
    <div className="h-72 w-full rounded-xl border border-border bg-card p-4 shadow-sm sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={series} barCategoryGap="22%" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickFormatter={(v) => {
              const m = String(v).match(/(\d{2}):00$/);
              return m ? `${m[1]}h` : String(v).slice(5, 10);
            }}
            interval="preserveStartEnd"
            minTickGap={28}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.45 }}
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--foreground)",
            }}
            labelFormatter={(v) => String(v)}
          />
          <Legend
            wrapperStyle={{ paddingTop: 10, fontSize: 13 }}
            formatter={(value) =>
              value === "sessions" ? t("sessions") : t("pageviews")
            }
          />
          <Bar
            dataKey="pageviews"
            name="pageviews"
            fill="var(--chart-1)"
            fillOpacity={0.28}
            radius={[4, 4, 0, 0]}
            maxBarSize={16}
          />
          <Bar
            dataKey="sessions"
            name="sessions"
            fill="var(--chart-1)"
            radius={[4, 4, 0, 0]}
            maxBarSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

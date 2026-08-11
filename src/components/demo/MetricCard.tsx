import { TrendBadge } from "./TrendBadge";

export function MetricCard({
  label,
  value,
  trend,
  positive = true,
}: {
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        <TrendBadge value={trend} positive={positive} />
      </div>
    </div>
  );
}

import { TrendBadge } from "./TrendBadge";
import { cn } from "@/lib/cn";

export function MetricCard({
  label,
  value,
  trend,
  positive = true,
  className,
}: {
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4",
        className,
      )}
    >
      <p className="truncate text-xs text-muted-foreground sm:text-sm">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-1.5 sm:mt-2 sm:gap-2">
        <p className="text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
          {value}
        </p>
        {trend && trend !== "—" ? (
          <TrendBadge value={trend} positive={positive} />
        ) : null}
      </div>
    </div>
  );
}

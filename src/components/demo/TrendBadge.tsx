import { cn } from "@/lib/cn";

export function TrendBadge({
  value,
  positive = true,
}: {
  value: string;
  positive?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        positive
          ? "bg-success-soft text-success"
          : "bg-accent-soft text-accent",
      )}
    >
      {value}
    </span>
  );
}

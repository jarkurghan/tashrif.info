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
        "inline-flex rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums sm:px-2 sm:text-xs",
        positive
          ? "bg-success-soft text-success"
          : "bg-accent-soft text-accent",
      )}
    >
      {value}
    </span>
  );
}

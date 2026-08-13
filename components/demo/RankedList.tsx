"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatCount, type RankedItem } from "@/lib/demo-data";

export function RankedList({
  tabs,
  datasets,
  className,
}: {
  tabs: { id: string; label: string }[];
  datasets: Record<string, RankedItem[]>;
  className?: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const items = datasets[active] ?? [];

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-border px-3 pt-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-t-lg px-3 py-2 text-sm transition",
              active === tab.id
                ? "border-b-2 border-primary font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ul className="flex-1 divide-y divide-border px-2 py-1">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 px-2 py-2.5 text-sm transition hover:bg-muted/50"
          >
            {item.flag && <span className="text-base">{item.flag}</span>}
            <span
              className="min-w-0 flex-1 truncate font-medium"
              title={item.title ?? item.label}
            >
              {item.label}
            </span>
            <span className="tabular-nums text-foreground">
              {formatCount(item.value)}
            </span>
            <span className="w-10 text-right tabular-nums text-muted-foreground">
              {item.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

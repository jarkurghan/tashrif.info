"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatCount, type RankedItem } from "@/lib/demo-data";
import { Maximize2 } from "lucide-react";

export function RankedList({
  tabs,
  datasets,
  detailsLabel,
}: {
  tabs: { id: string; label: string }[];
  datasets: Record<string, RankedItem[]>;
  detailsLabel: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const items = datasets[active] ?? [];

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm">
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
            <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
            <span className="tabular-nums text-foreground">
              {formatCount(item.value)}
            </span>
            <span className="w-10 text-right tabular-nums text-muted-foreground">
              {item.percent}%
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="flex items-center justify-center gap-1.5 border-t border-border py-2.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        {detailsLabel}
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

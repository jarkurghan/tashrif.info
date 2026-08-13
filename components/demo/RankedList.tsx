"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatCount, type RankedItem } from "@/lib/demo-data";

export function RankedList({
  title,
  tabs,
  datasets,
  empty,
  className,
}: {
  title?: string;
  tabs: { id: string; label: string }[];
  datasets: Record<string, RankedItem[]>;
  empty?: string;
  className?: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const items = datasets[active] ?? [];
  const showTabs = tabs.length > 1;
  const showKeyCol = items.some((i) => i.code || i.flag);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-4",
          showTabs ? "border-b border-border pt-3" : "pt-4",
        )}
      >
        {title && !showTabs && (
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        )}
        {showTabs && (
          <div className="flex flex-wrap gap-1">
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
        )}
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          {empty ?? "—"}
        </p>
      ) : (
        <ul className="max-h-[22rem] min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {items.map((item) => (
            <li key={item.label} className="relative">
              <div
                className="pointer-events-none absolute inset-y-0.5 left-0 rounded-md bg-primary/12"
                style={{ width: `${Math.min(100, Math.max(0, item.percent))}%` }}
                aria-hidden
              />
              <div className="relative flex items-center gap-3 px-3 py-2 text-sm">
                {showKeyCol && (
                  <span className="inline-flex w-8 shrink-0 items-center font-mono text-xs font-semibold uppercase leading-none tracking-wide text-muted-foreground">
                    {item.code ? item.code.toUpperCase() : (item.flag ?? "")}
                  </span>
                )}
                <span
                  className="min-w-0 flex-1 truncate font-medium"
                  title={item.title ?? item.label}
                >
                  {item.label}
                </span>
                <span className="tabular-nums text-foreground">
                  {formatCount(item.value)}
                </span>
                <span className="w-11 shrink-0 text-right tabular-nums text-muted-foreground">
                  {item.percent}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

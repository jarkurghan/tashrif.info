"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Sheet } from "@/components/ui/Sheet";
import { useDateRange } from "@/components/app/DateRangeProvider";
import { RANGE_KEYS, type RangeKey } from "@/lib/date-range";
import { cn } from "@/lib/cn";

export function DateRangePicker() {
  const t = useTranslations("demo.ranges");
  const { range, setRange } = useDateRange();
  const [open, setOpen] = useState(false);

  const options = RANGE_KEYS.map((key) => ({
    value: key,
    label: t(key),
  }));

  return (
    <>
      <div className="hidden md:block w-[9.5rem]">
        <Select
          aria-label={t("label")}
          size="sm"
          align="end"
          value={range}
          onChange={(v) => setRange(v as RangeKey)}
          options={options}
          triggerClassName="bg-card"
        />
      </div>

      <button
        type="button"
        className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition hover:text-foreground md:hidden"
        aria-label={`${t("label")}: ${t(range)}`}
        onClick={() => setOpen(true)}
      >
        <CalendarDays className="h-4 w-4" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title={t("label")}>
        <div className="space-y-1">
          {RANGE_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setRange(key);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition",
                range === key
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </Sheet>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { logs } from "@/lib/demo-data";
import { Select } from "@/components/ui/Select";
import { Filter, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatUserAgent } from "@/lib/parse-user-agent";

const PAGE_SIZE = 20;

export function LogsTable() {
  const t = useTranslations("demo.logs");
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState("ALL");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return logs.filter((row) => {
      const matchesQ =
        !q ||
        row.path.toLowerCase().includes(q) ||
        row.ip.includes(q) ||
        row.visitorId.toLowerCase().includes(q) ||
        row.userAgent.toLowerCase().includes(q);
      const matchesM = method === "ALL" || row.method === method;
      return matchesQ && matchesM;
    });
  }, [query, method]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const slice = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const to = Math.min(filtered.length, (safePage + 1) * PAGE_SIZE);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder={t("search")}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            aria-label={t("filter")}
            value={method}
            onChange={(v) => {
              setMethod(v);
              setPage(0);
            }}
            className="w-[8.5rem]"
            options={[
              { value: "ALL", label: t("filter") },
              { value: "GET", label: "GET" },
              { value: "POST", label: "POST" },
              { value: "PUT", label: "PUT" },
            ]}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">{t("time")}</th>
              <th className="px-4 py-3 font-medium">{t("method")}</th>
              <th className="px-4 py-3 font-medium">{t("path")}</th>
              <th className="px-4 py-3 font-medium">{t("status")}</th>
              <th className="px-4 py-3 font-medium">{t("country")}</th>
              <th className="px-4 py-3 font-medium">{t("ip")}</th>
              <th className="px-4 py-3 font-medium">{t("visitor")}</th>
              <th className="px-4 py-3 font-medium">{t("userAgent")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {slice.map((row) => (
              <tr key={row.id} className="transition hover:bg-muted/30">
                <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-muted-foreground">
                  {row.time}
                </td>
                <td className="px-4 py-2.5">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {row.method}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-medium">{row.path}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      row.status < 300
                        ? "bg-success-soft text-success"
                        : row.status < 400
                          ? "bg-primary-soft text-primary"
                          : "bg-accent-soft text-accent",
                    )}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="mr-1">{row.flag}</span>
                  {row.country}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  {row.ip}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  {row.visitorId}
                </td>
                <td
                  className="max-w-[280px] truncate px-4 py-2.5 text-sm"
                  title={row.userAgent}
                >
                  {formatUserAgent(row.userAgent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t("showing", { from, to, total: filtered.length })}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            {t("prev")}
          </button>
          <button
            type="button"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            {t("next")}
          </button>
        </div>
      </div>
    </div>
  );
}

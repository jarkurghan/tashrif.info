"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useLocale, useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { Select } from "@/components/ui/Select";
import { Filter, Search } from "lucide-react";
import { formatUserAgent } from "@/lib/parse-user-agent";
import { countryLabel, flagEmoji } from "@/lib/geo-display";
import { useDateRange } from "@/components/app/DateRangeProvider";
import { useLivePageviews, type LivePageview } from "@/components/app/LiveAppSocket";

type LogItem = {
  id: string;
  time: string;
  method: string | null;
  path: string;
  country: string | null;
  ip: string | null;
  visitorId: string;
  userAgent: string | null;
};

const PAGE_SIZE = 20;

function formatLogTime(iso: string, locale: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  const tags = locale.startsWith("uz")
    ? ["uz-Latn-UZ", "en-GB"]
    : [locale, "en-GB"];
  for (const tag of tags) {
    try {
      const formatted = new Intl.DateTimeFormat(tag, opts).format(d);
      if (!/[\u0400-\u04FF]/.test(formatted)) return formatted;
    } catch {
      /* try next */
    }
  }
  return new Intl.DateTimeFormat("en-GB", opts).format(d);
}

function uaShort(raw: string | null | undefined) {
  return formatUserAgent(raw).slice(0, 10);
}

function CountryCell({ code, locale }: { code: string | null; locale: string }) {
  if (!code) return "—";
  const flag = flagEmoji(code);
  return (
    <span className="inline-flex items-center gap-2">
      {flag && <span className="text-base leading-none">{flag}</span>}
      {countryLabel(code, locale)}
    </span>
  );
}

export default function LogsAnalyticsPage() {
  const { activeAppId: appId } = useActiveApp();
  const { data } = useSession();
  const t = useTranslations("demo.logs");
  const title = useTranslations("demo");
  const locale = useLocale();
  const { queryString, range, ready } = useDateRange();
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<LogItem[]>([]);

  useEffect(() => {
    setPage(1);
  }, [range]);

  useEffect(() => {
    if (!data?.apiToken || !appId || !ready) return;
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
      q: query,
      method,
    });
    apiFetch<{ items: LogItem[]; total: number }>(
      `/v1/apps/${appId}/logs?${params}&${queryString}`,
      { token: data.apiToken },
    )
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
      })
      .catch(console.error);
  }, [data?.apiToken, appId, page, query, method, queryString, ready]);

  const filtersRef = useRef({ page, query, method });
  filtersRef.current = { page, query, method };

  useLivePageviews((item: LivePageview) => {
    const { page: p, query: q, method: m } = filtersRef.current;
    if (p !== 1) return;
    if (m !== "ALL" && item.method !== m) return;
    const needle = q.trim().toLowerCase();
    if (needle) {
      const hay = `${item.path} ${item.ip ?? ""} ${item.visitorId} ${item.userAgent ?? ""}`.toLowerCase();
      if (!hay.includes(needle)) return;
    }
    setItems((prev) => {
      if (prev.some((row) => row.id === item.id)) return prev;
      return [item, ...prev].slice(0, PAGE_SIZE);
    });
    setTotal((n) => n + 1);
  });

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(total, (page - 1) * PAGE_SIZE + items.length);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <AppHeader title={title("titles.logs")} />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:p-6">
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
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
                  setPage(1);
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
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground md:text-xs">
                <tr>
                  <th className="hidden px-3 py-2.5 md:table-cell md:px-4 md:py-3">
                    {t("time")}
                  </th>
                  <th className="hidden px-3 py-2.5 md:table-cell md:px-4 md:py-3">
                    {t("method")}
                  </th>
                  <th className="px-3 py-2.5 md:px-4 md:py-3">{t("path")}</th>
                  <th className="hidden px-3 py-2.5 md:table-cell md:px-4 md:py-3">
                    {t("country")}
                  </th>
                  <th className="px-3 py-2.5 md:hidden">{t("ip")}</th>
                  <th className="hidden px-3 py-2.5 lg:table-cell lg:px-4 lg:py-3">
                    {t("ip")}
                  </th>
                  <th className="hidden px-3 py-2.5 lg:table-cell lg:px-4 lg:py-3">
                    {t("visitor")}
                  </th>
                  <th className="px-3 py-2.5 md:hidden">{t("userAgent")}</th>
                  <th className="hidden px-3 py-2.5 lg:table-cell lg:px-4 lg:py-3">
                    {t("userAgent")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30">
                    <td
                      className="hidden whitespace-nowrap px-3 py-2 tabular-nums text-muted-foreground md:table-cell md:px-4 md:py-2.5"
                      title={row.time}
                    >
                      {formatLogTime(row.time, locale)}
                    </td>
                    <td className="hidden px-3 py-2 md:table-cell md:px-4 md:py-2.5">
                      <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] md:text-xs">
                        {row.method}
                      </span>
                    </td>
                    <td className="max-w-[10rem] truncate px-3 py-2 font-medium sm:max-w-none md:px-4 md:py-2.5">
                      {row.path}
                      {row.method ? (
                        <span className="mt-0.5 block font-mono text-[11px] font-normal text-muted-foreground md:hidden">
                          {row.method}
                        </span>
                      ) : null}
                    </td>
                    <td className="hidden px-3 py-2 md:table-cell md:px-4 md:py-2.5">
                      <CountryCell code={row.country} locale={locale} />
                    </td>
                    <td className="px-3 py-2 md:hidden">
                      <span className="block font-mono text-[11px]">
                        {row.ip ?? "—"}
                      </span>
                      <span className="mt-0.5 block text-muted-foreground">
                        <CountryCell code={row.country} locale={locale} />
                      </span>
                    </td>
                    <td className="hidden px-3 py-2 font-mono text-[11px] lg:table-cell lg:px-4 lg:py-2.5 lg:text-xs">
                      {row.ip}
                    </td>
                    <td className="hidden px-3 py-2 font-mono text-[11px] lg:table-cell lg:px-4 lg:py-2.5 lg:text-xs">
                      {row.visitorId}
                    </td>
                    <td
                      className="px-3 py-2 font-mono text-[11px] md:hidden"
                      title={row.userAgent ?? undefined}
                    >
                      {uaShort(row.userAgent)}
                    </td>
                    <td
                      className="hidden max-w-[280px] truncate px-3 py-2 lg:table-cell lg:px-4 lg:py-2.5"
                      title={row.userAgent ?? undefined}
                    >
                      {formatUserAgent(row.userAgent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
            <p className="text-muted-foreground">
              {t("showing", { from, to, total })}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
              >
                {t("prev")}
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
              >
                {t("next")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

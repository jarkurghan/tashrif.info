"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useLocale, useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { Search } from "lucide-react";
import { useDateRange } from "@/components/app/DateRangeProvider";

type PageRow = {
  path: string;
  visits: number;
  visitors: number;
  sessions: number;
  countries: number;
  percent: number;
};

function toCount(v: unknown): number {
  const n = typeof v === "bigint" ? Number(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatCount(n: number, locale: string) {
  const value = toCount(n);
  const tag = locale === "uz" ? "uz-UZ" : "en-US";
  return new Intl.NumberFormat(tag).format(value);
}

export default function PagesAnalyticsPage() {
  const { activeAppId: appId } = useActiveApp();
  const { data } = useSession();
  const locale = useLocale();
  const t = useTranslations("demo");
  const tp = useTranslations("demo.pagesTable");
  const { queryString, ready } = useDateRange();
  const [items, setItems] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const loadedRef = useRef(false);

  useEffect(() => {
    loadedRef.current = false;
  }, [appId]);

  const load = useCallback(() => {
    if (!data?.apiToken || !appId || !ready) return;
    const silent = loadedRef.current;
    if (!silent) setLoading(true);
    apiFetch<{ items: PageRow[] }>(`/v1/apps/${appId}/pages?${queryString}`, {
      token: data.apiToken,
    })
      .then((r) =>
        setItems(
          (r.items ?? []).map((row) => ({
            path: row.path,
            visits: toCount(row.visits),
            visitors: toCount(row.visitors),
            sessions: toCount(row.sessions),
            countries: toCount(row.countries),
            percent: toCount(row.percent),
          })),
        ),
      )
      .catch(console.error)
      .finally(() => {
        loadedRef.current = true;
        if (!silent) setLoading(false);
      });
  }, [data?.apiToken, appId, queryString, ready]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((row) => row.path.toLowerCase().includes(q));
  }, [items, query]);

  const totals = useMemo(() => {
    return filtered.reduce((acc, row) => {
      acc.visits += row.visits;
      return acc;
    }, { visits: 0 });
  }, [filtered]);

  return (
    <>
      <AppHeader title={t("titles.pages")} />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:p-6">
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">{tp("title")}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {tp("hint")}
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tp("search")}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground md:text-xs">
                <tr>
                  <th className="px-3 py-2.5 font-medium md:px-4 md:py-3">
                    {tp("path")}
                  </th>
                  <th
                    className="w-px whitespace-nowrap px-1.5 py-2.5 text-right font-medium tracking-normal md:px-4 md:py-3 md:tracking-wide"
                    title={tp("visitors")}
                  >
                    <span className="md:hidden">{tp("visitorsShort")}</span>
                    <span className="hidden md:inline">{tp("visitors")}</span>
                  </th>
                  <th
                    className="w-px whitespace-nowrap px-1.5 py-2.5 text-right font-medium tracking-normal md:px-4 md:py-3 md:tracking-wide"
                    title={tp("visits")}
                  >
                    <span className="md:hidden">{tp("visitsShort")}</span>
                    <span className="hidden md:inline">{tp("visits")}</span>
                  </th>
                  <th className="hidden px-3 py-2.5 text-right font-medium lg:table-cell lg:px-4 lg:py-3">
                    {tp("sessions")}
                  </th>
                  <th className="hidden px-3 py-2.5 text-right font-medium lg:table-cell lg:px-4 lg:py-3">
                    {tp("countries")}
                  </th>
                  <th className="px-3 py-2.5 text-right font-medium md:px-4 md:py-3">
                    {tp("share")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-muted-foreground md:px-4"
                    >
                      {tp("loading")}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-muted-foreground md:px-4"
                    >
                      {tp("empty")}
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.path} className="hover:bg-muted/30">
                      <td className="max-w-[11rem] truncate px-3 py-2 font-medium sm:max-w-[28rem] md:px-4 md:py-2.5">
                        {row.path}
                      </td>
                      <td className="w-px whitespace-nowrap px-1.5 py-2 text-right tabular-nums md:px-4 md:py-2.5">
                        {formatCount(row.visitors, locale)}
                      </td>
                      <td className="w-px whitespace-nowrap px-1.5 py-2 text-right tabular-nums font-medium md:px-4 md:py-2.5">
                        {formatCount(row.visits, locale)}
                      </td>
                      <td className="hidden px-3 py-2 text-right tabular-nums text-muted-foreground lg:table-cell lg:px-4 lg:py-2.5">
                        {formatCount(row.sessions, locale)}
                      </td>
                      <td className="hidden px-3 py-2 text-right tabular-nums text-muted-foreground lg:table-cell lg:px-4 lg:py-2.5">
                        {formatCount(row.countries, locale)}
                      </td>
                      <td className="px-3 py-2 text-right md:px-4 md:py-2.5">
                        <div className="ml-auto flex items-center justify-end gap-2 md:w-28">
                          <div className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-muted md:block">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.min(100, Math.max(0, row.percent))}%`,
                              }}
                            />
                          </div>
                          <span className="tabular-nums text-[11px] text-muted-foreground md:w-8 md:text-right md:text-xs">
                            {row.percent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {!loading && filtered.length > 0 && (
                <tfoot className="border-t border-border bg-muted/20 text-[11px] text-muted-foreground md:text-xs">
                  <tr>
                    <td className="px-3 py-2 font-medium text-foreground md:px-4 md:py-3">
                      {tp("showing", { count: filtered.length })}
                    </td>
                    <td className="w-px whitespace-nowrap px-1.5 py-2 text-right md:px-4 md:py-3">
                      —
                    </td>
                    <td className="w-px whitespace-nowrap px-1.5 py-2 text-right tabular-nums font-medium text-foreground md:px-4 md:py-3">
                      {formatCount(totals.visits, locale)}
                    </td>
                    <td className="hidden px-3 py-2 text-right lg:table-cell lg:px-4 lg:py-3">
                      —
                    </td>
                    <td className="hidden px-3 py-2 lg:table-cell lg:px-4 lg:py-3" />
                    <td className="px-3 py-2 md:px-4 md:py-3" />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

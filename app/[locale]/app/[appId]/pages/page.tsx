"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useLocale, useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { Search } from "lucide-react";

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
  const [items, setItems] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!data?.apiToken || !appId) return;
    setLoading(true);
    apiFetch<{ items: PageRow[] }>(`/v1/apps/${appId}/pages`, {
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
      .finally(() => setLoading(false));
  }, [data?.apiToken, appId]);

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
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
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
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">{tp("path")}</th>
                  <th className="px-4 py-3 font-medium text-right">
                    {tp("visitors")}
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    {tp("visits")}
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    {tp("sessions")}
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    {tp("countries")}
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    {tp("share")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      {tp("loading")}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      {tp("empty")}
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.path} className="hover:bg-muted/30">
                      <td className="max-w-[28rem] truncate px-4 py-2.5 font-medium">
                        {row.path}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {formatCount(row.visitors, locale)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                        {formatCount(row.visits, locale)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                        {formatCount(row.sessions, locale)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                        {formatCount(row.countries, locale)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="ml-auto flex w-28 items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.min(100, Math.max(0, row.percent))}%`,
                              }}
                            />
                          </div>
                          <span className="w-8 text-right tabular-nums text-xs text-muted-foreground">
                            {row.percent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {!loading && filtered.length > 0 && (
                <tfoot className="border-t border-border bg-muted/20 text-xs text-muted-foreground">
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {tp("showing", { count: filtered.length })}
                    </td>
                    <td className="px-4 py-3 text-right">—</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-foreground">
                      {formatCount(totals.visits, locale)}
                    </td>
                    <td className="px-4 py-3 text-right">—</td>
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
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

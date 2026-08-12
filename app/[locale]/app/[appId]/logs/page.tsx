"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { Select } from "@/components/ui/Select";
import { Filter, Search } from "lucide-react";
import { cn } from "@/lib/cn";

type LogItem = {
  id: string;
  time: string;
  method: string | null;
  path: string;
  status: number | null;
  country: string | null;
  ip: string | null;
  visitorId: string;
};

export default function LogsAnalyticsPage() {
  const { activeAppId: appId } = useActiveApp();
  const { data } = useSession();
  const t = useTranslations("demo.logs");
  const title = useTranslations("demo");
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<LogItem[]>([]);

  useEffect(() => {
    if (!data?.apiToken || !appId) return;
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "20",
      q: query,
      method,
    });
    apiFetch<{ items: LogItem[]; total: number }>(
      `/v1/apps/${appId}/logs?${params}`,
      { token: data.apiToken },
    )
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
      })
      .catch(console.error);
  }, [data?.apiToken, appId, page, query, method]);

  const from = total === 0 ? 0 : (page - 1) * 10 + 1;
  const to = Math.min(total, page * 10);
  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <>
      <AppHeader title={title("titles.logs")} />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
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
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">{t("time")}</th>
                  <th className="px-4 py-3">{t("method")}</th>
                  <th className="px-4 py-3">{t("path")}</th>
                  <th className="px-4 py-3">{t("status")}</th>
                  <th className="px-4 py-3">{t("country")}</th>
                  <th className="px-4 py-3">{t("ip")}</th>
                  <th className="px-4 py-3">{t("visitor")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
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
                          (row.status ?? 200) < 400
                            ? "bg-success-soft text-success"
                            : "bg-accent-soft text-accent",
                        )}
                      >
                        {row.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{row.country ?? "—"}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{row.ip}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{row.visitorId}</td>
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

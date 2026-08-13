"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { domains as seed } from "@/lib/demo-data";
import { Sheet } from "@/components/ui/Sheet";
import { Eye, Plus } from "lucide-react";

type Row = (typeof seed)[number];

export default function DomainsPage() {
  const t = useTranslations("demo.domains");
  const title = useTranslations("demo");
  const roles = useTranslations("demo.access");
  const [rows, setRows] = useState(seed);
  const [addOpen, setAddOpen] = useState(false);
  const [domainInput, setDomainInput] = useState("");
  const [detail, setDetail] = useState<Row | null>(null);

  function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const domain = domainInput.trim().toLowerCase();
    if (!domain) return;
    const next: Row = {
      domain,
      clientId: `app_${Math.random().toString(16).slice(2, 8)}`,
      role: "owner",
    };
    setRows((prev) => [next, ...prev]);
    setAddOpen(false);
    setDomainInput("");
    setDetail(next);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {title("titles.domains")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("pageHint")}</p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          {t("add")}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground md:text-xs">
              <tr>
                <th className="px-3 py-2.5 font-medium md:px-4 md:py-3">
                  {t("name")}
                </th>
                <th className="hidden px-3 py-2.5 font-medium md:table-cell md:px-4 md:py-3">
                  client_id
                </th>
                <th className="px-3 py-2.5 font-medium md:px-4 md:py-3">
                  {t("role")}
                </th>
                <th className="px-3 py-2.5 text-right font-medium md:px-4 md:py-3">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((a) => (
                <tr key={a.clientId} className="hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium md:px-4 md:py-3">
                    {a.domain}
                  </td>
                  <td className="hidden px-3 py-2 font-mono text-[11px] text-muted-foreground md:table-cell md:px-4 md:py-3 md:text-xs">
                    {a.clientId}
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    {roles(a.role)}
                  </td>
                  <td className="px-3 py-2 text-right md:px-4 md:py-3">
                    <button
                      type="button"
                      onClick={() => setDetail(a)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline md:text-sm"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t("details")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={t("add")}
        description={t("addHint")}
      >
        <form onSubmit={onCreate} className="flex h-full flex-col gap-5">
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">{t("name")}</span>
            <input
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="example.uz"
              autoFocus
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring/40"
            />
          </label>
          <div className="mt-auto flex gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {t("add")}
            </button>
          </div>
        </form>
      </Sheet>

      <Sheet
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.domain ?? t("details")}
        description={t("detailsHint")}
        wide
      >
        {detail && (
          <div className="space-y-6">
            <dl className="divide-y divide-border rounded-xl border border-border">
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{t("name")}</dt>
                <dd className="font-medium">{detail.domain}</dd>
              </div>
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">client_id</dt>
                <dd className="font-mono text-xs">{detail.clientId}</dd>
              </div>
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{t("role")}</dt>
                <dd className="font-medium">{roles(detail.role)}</dd>
              </div>
            </dl>
            <p className="text-sm text-muted-foreground">{t("secretHidden")}</p>
          </div>
        )}
      </Sheet>
    </div>
  );
}

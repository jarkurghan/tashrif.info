"use client";

import { useTranslations } from "next-intl";
import { reportChats } from "@/lib/demo-data";
import { Eye, Plus } from "lucide-react";

export function ReportsForm() {
  const t = useTranslations("demo.reports");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {t("connected")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("sub")}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          {t("linkChat")}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground md:text-xs">
              <tr>
                <th className="px-3 py-2.5 font-medium md:px-4 md:py-3">
                  {t("chat")}
                </th>
                <th className="hidden px-3 py-2.5 font-medium md:table-cell md:px-4 md:py-3">
                  Chat ID
                </th>
                <th className="px-3 py-2.5 font-medium md:px-4 md:py-3">
                  {t("reportsCol")}
                </th>
                <th className="px-3 py-2.5 text-right font-medium md:px-4 md:py-3">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reportChats.map((chat) => (
                <tr key={chat.chatId} className="hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium md:px-4 md:py-3">
                    {chat.name}
                    <span className="mt-0.5 block font-mono text-[11px] font-normal text-muted-foreground md:hidden">
                      {chat.chatId}
                    </span>
                  </td>
                  <td className="hidden px-3 py-2 font-mono text-[11px] text-muted-foreground md:table-cell md:px-4 md:py-3 md:text-xs">
                    {chat.chatId}
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    {chat.reports.length === 0 ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {chat.reports.map((r) => (
                          <span
                            key={r}
                            className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] text-primary md:text-xs"
                          >
                            {t(r)}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right md:px-4 md:py-3">
                    <button
                      type="button"
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
    </div>
  );
}

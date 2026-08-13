import { getTranslations, setRequestLocale } from "next-intl/server";
import { domains } from "@/lib/demo-data";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export default async function DomainsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("demo.domains");
  const roles = await getTranslations("demo.access");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
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
                {t("appId")}
              </th>
              <th className="hidden px-3 py-2.5 font-medium md:table-cell md:px-4 md:py-3">
                {t("status")}
              </th>
              <th className="hidden px-3 py-2.5 font-medium md:table-cell md:px-4 md:py-3">
                {t("role")}
              </th>
              <th className="px-3 py-2.5 text-right font-medium md:px-4 md:py-3">
                Visitors
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {domains.map((d) => (
              <tr key={d.appId} className="hover:bg-muted/30">
                <td className="px-3 py-2 font-medium md:px-4 md:py-3">
                  {d.domain}
                  <span
                    className={cn(
                      "mt-0.5 block w-fit rounded-full px-2 py-0.5 text-[11px] font-medium md:hidden",
                      d.status === "active"
                        ? "bg-success-soft text-success"
                        : "bg-accent-soft text-accent",
                    )}
                  >
                    {t(d.status)}
                  </span>
                </td>
                <td className="hidden px-3 py-2 font-mono text-[11px] text-muted-foreground md:table-cell md:px-4 md:py-3 md:text-xs">
                  {d.appId}
                </td>
                <td className="hidden px-3 py-2 md:table-cell md:px-4 md:py-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      d.status === "active"
                        ? "bg-success-soft text-success"
                        : "bg-accent-soft text-accent",
                    )}
                  >
                    {t(d.status)}
                  </span>
                </td>
                <td className="hidden px-3 py-2 capitalize md:table-cell md:px-4 md:py-3">
                  {roles(d.role)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums md:px-4 md:py-3">
                  {d.visitors}
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

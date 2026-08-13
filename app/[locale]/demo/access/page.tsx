import { getTranslations, setRequestLocale } from "next-intl/server";
import { accessRows } from "@/lib/demo-data";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/cn";

export default async function AccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("demo.access");
  const title = await getTranslations("demo");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {title("titles.access")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("pageHint")}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
        >
          <UserPlus className="h-4 w-4" />
          {t("invite")}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground md:text-xs">
            <tr>
              <th className="px-3 py-2.5 font-medium md:px-4 md:py-3">
                {t("email")}
              </th>
              <th className="px-3 py-2.5 font-medium md:px-4 md:py-3">
                {t("role")}
              </th>
              <th className="hidden px-3 py-2.5 font-medium md:table-cell md:px-4 md:py-3">
                Status
              </th>
              <th className="px-3 py-2.5 font-medium text-right md:px-4 md:py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {accessRows.map((row) => (
              <tr key={row.email} className="hover:bg-muted/30">
                <td className="px-3 py-2 font-medium md:px-4 md:py-3">
                  <span className="inline-flex flex-wrap items-center gap-2">
                    {row.email}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium md:hidden",
                        row.status === "accepted"
                          ? "bg-success-soft text-success"
                          : "bg-accent-soft text-accent",
                      )}
                    >
                      {t(row.status)}
                    </span>
                  </span>
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3">{t(row.role)}</td>
                <td className="hidden px-3 py-2 md:table-cell md:px-4 md:py-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      row.status === "accepted"
                        ? "bg-success-soft text-success"
                        : "bg-accent-soft text-accent",
                    )}
                  >
                    {t(row.status)}
                  </span>
                </td>
                <td className="px-3 py-2 text-right md:px-4 md:py-3">
                  {row.role !== "owner" && (
                    <button
                      type="button"
                      className="text-muted-foreground transition hover:text-danger"
                    >
                      {t("revoke")}
                    </button>
                  )}
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

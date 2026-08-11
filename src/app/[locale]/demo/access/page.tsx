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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-end">
        <label className="flex-1 text-sm">
          <span className="mb-1.5 block text-muted-foreground">{t("email")}</span>
          <input
            defaultValue=""
            placeholder="name@company.uz"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring/40"
          />
        </label>
        <label className="text-sm sm:w-44">
          <span className="mb-1.5 block text-muted-foreground">{t("role")}</span>
          <select className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring/40">
            <option value="admin">{t("admin")}</option>
            <option value="viewer">{t("viewer")}</option>
          </select>
        </label>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
        >
          <UserPlus className="h-4 w-4" />
          {t("invite")}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">{t("email")}</th>
              <th className="px-4 py-3 font-medium">{t("role")}</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {accessRows.map((row) => (
              <tr key={row.email} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{row.email}</td>
                <td className="px-4 py-3">{t(row.role)}</td>
                <td className="px-4 py-3">
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
                <td className="px-4 py-3 text-right">
                  {row.role !== "owner" && (
                    <button
                      type="button"
                      className="text-sm text-muted-foreground transition hover:text-danger"
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
  );
}

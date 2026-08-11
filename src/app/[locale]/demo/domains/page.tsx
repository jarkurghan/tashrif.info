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
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">{t("name")}</th>
              <th className="px-4 py-3 font-medium">{t("appId")}</th>
              <th className="px-4 py-3 font-medium">{t("status")}</th>
              <th className="px-4 py-3 font-medium">{t("role")}</th>
              <th className="px-4 py-3 font-medium text-right">Visitors</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {domains.map((d) => (
              <tr key={d.appId} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{d.domain}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {d.appId}
                </td>
                <td className="px-4 py-3">
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
                <td className="px-4 py-3 capitalize">{roles(d.role)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{d.visitors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

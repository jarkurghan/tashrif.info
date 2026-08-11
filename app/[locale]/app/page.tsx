"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { Plus } from "lucide-react";

type AppRow = {
  id: string;
  domain: string;
  name: string;
  role: string;
};

export default function AppsPage() {
  const { data } = useSession();
  const t = useTranslations("demo.domains");
  const [apps, setApps] = useState<AppRow[]>([]);
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [created, setCreated] = useState<AppRow | null>(null);

  async function load() {
    if (!data?.apiToken) return;
    setLoading(true);
    try {
      const res = await apiFetch<{ apps: AppRow[] }>("/v1/apps", {
        token: data.apiToken,
      });
      setApps(res.apps);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.apiToken]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!data?.apiToken || !domain.trim()) return;
    setError(null);
    try {
      const res = await apiFetch<{ app: AppRow }>("/v1/apps", {
        method: "POST",
        token: data.apiToken,
        body: JSON.stringify({ domain: domain.trim() }),
      });
      setCreated(res.app);
      setDomain("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  return (
    <>
      <AppHeader title={t("name")} />
      <main className="flex-1 space-y-6 p-4 sm:p-6">
        <form
          onSubmit={onCreate}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-end"
        >
          <label className="flex-1 text-sm">
            <span className="mb-1.5 block text-muted-foreground">{t("name")}</span>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.uz"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring/40"
              required
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            {t("add")}
          </button>
        </form>

        {error && (
          <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">{error}</p>
        )}

        {created && (
          <div className="rounded-xl border border-primary/30 bg-primary-soft/40 p-4 text-sm">
            <p className="font-semibold">App created</p>
            <p className="mt-1">
              Domain: <b>{created.domain}</b>
            </p>
            <p className="mt-1 font-mono text-xs">
              app_id: {created.id}
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-card p-3 text-xs">{`import { track, buildPayload } from "tashrif";
// middleware.ts — TASHRIF_APP_ID=${created.id}`}</pre>
            <Link
              href={`/app/${created.id}/traffic`}
              className="mt-3 inline-flex text-primary underline"
            >
              Open dashboard →
            </Link>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading…</p>
          ) : apps.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No domains yet.</p>
          ) : (
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("name")}</th>
                  <th className="px-4 py-3 font-medium">{t("appId")}</th>
                  <th className="px-4 py-3 font-medium">{t("role")}</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {apps.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{a.domain}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {a.id}
                    </td>
                    <td className="px-4 py-3 capitalize">{a.role}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/app/${a.id}/traffic`}
                        className="text-primary hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}

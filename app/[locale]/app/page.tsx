"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { Check, Copy, Plus } from "lucide-react";

type AppRow = {
  id: string;
  clientId?: string;
  domain: string;
  name: string;
  role: string;
};

type CreatedCreds = {
  app: AppRow;
  clientId: string;
  clientSecret: string;
};

function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
      aria-label={label}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-primary" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copy
        </>
      )}
    </button>
  );
}

export default function AppsPage() {
  const { data } = useSession();
  const t = useTranslations("demo.domains");
  const [apps, setApps] = useState<AppRow[]>([]);
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [created, setCreated] = useState<CreatedCreds | null>(null);

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
      const res = await apiFetch<CreatedCreds>("/v1/apps", {
        method: "POST",
        token: data.apiToken,
        body: JSON.stringify({ domain: domain.trim() }),
      });
      setCreated(res);
      setDomain("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  async function onRotate(appId: string) {
    if (!data?.apiToken) return;
    if (
      !window.confirm(
        "Rotate client secret? The old secret stops working immediately.",
      )
    ) {
      return;
    }
    setError(null);
    try {
      const res = await apiFetch<CreatedCreds>(
        `/v1/apps/${appId}/rotate-secret`,
        { method: "POST", token: data.apiToken },
      );
      setCreated(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rotate failed");
    }
  }

  const envSnippet = created
    ? `# .env
TASHRIF_CLIENT_ID=${created.clientId}
TASHRIF_CLIENT_SECRET=${created.clientSecret}

# middleware.ts
import { track, buildPayload } from "tashrif";
const { payload, setCookies } = buildPayload(req);
for (const c of setCookies ?? []) res.cookies.set(c.name, c.value, c.options);
void track(payload);`
    : "";

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
          <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
            {error}
          </p>
        )}

        {created && (
          <div className="rounded-xl border border-primary/30 bg-primary-soft/40 p-4 text-sm">
            <p className="font-semibold">Save these credentials now</p>
            <p className="mt-1 text-muted-foreground">
              The client secret is shown only once. Store it in server env — never
              in the browser.
            </p>
            <p className="mt-3">
              Domain: <b>{created.app.domain}</b>
            </p>
            <dl className="mt-3 space-y-2 font-mono text-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <dt className="text-muted-foreground">client_id</dt>
                  <dd className="break-all">{created.clientId}</dd>
                </div>
                <CopyButton value={created.clientId} label="Copy client_id" />
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <dt className="text-muted-foreground">client_secret</dt>
                  <dd className="break-all">{created.clientSecret}</dd>
                </div>
                <CopyButton
                  value={created.clientSecret}
                  label="Copy client_secret"
                />
              </div>
            </dl>
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">.env snippet</span>
                <CopyButton value={envSnippet} label="Copy env snippet" />
              </div>
              <pre className="overflow-x-auto rounded-lg bg-card p-3 text-xs">
                {envSnippet}
              </pre>
            </div>
            <Link
              href={`/app/${created.app.id}/traffic`}
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
                  <th className="px-4 py-3 font-medium">client_id</th>
                  <th className="px-4 py-3 font-medium">{t("role")}</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {apps.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{a.domain}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {a.clientId ?? a.id}
                    </td>
                    <td className="px-4 py-3 capitalize">{a.role}</td>
                    <td className="space-x-3 px-4 py-3 text-right">
                      {a.role === "owner" && (
                        <button
                          type="button"
                          onClick={() => void onRotate(a.id)}
                          className="text-muted-foreground hover:text-foreground hover:underline"
                        >
                          Rotate secret
                        </button>
                      )}
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

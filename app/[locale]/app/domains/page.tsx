"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { apiFetch, ApiError } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { useActiveApp, type AppRow } from "@/components/app/ActiveAppProvider";
import { Sheet } from "@/components/ui/Sheet";
import { cn } from "@/lib/cn";
import { Check, Copy, Eye, LogOut, Plus, Trash2 } from "lucide-react";

type Creds = {
  app: { id: string; domain: string; name: string; role?: string };
  clientId: string;
  clientSecret: string;
};

type DeleteStep = "idle" | "confirm" | "type";
type LeaveStep = "idle" | "confirm";

function CopyButton({
  value,
  label,
  copiedLabel,
}: {
  value: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
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
          {copiedLabel}
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          {label}
        </>
      )}
    </button>
  );
}

function CredsBlock({
  creds,
  t,
}: {
  creds: Creds;
  t: (key: string) => string;
}) {
  const envSnippet = `# .env
TASHRIF_CLIENT_ID=${creds.clientId}
TASHRIF_CLIENT_SECRET=${creds.clientSecret}

# middleware.ts
import { track, buildPayload } from "tashrif";
const { payload, setCookies } = buildPayload(req);
for (const c of setCookies ?? []) res.cookies.set(c.name, c.value, c.options);
void track(payload);`;

  return (
    <div className="space-y-4 rounded-xl border border-primary/25 bg-primary-soft/30 p-4">
      <div>
        <p className="text-sm font-semibold">{t("secretOnceTitle")}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {t("secretOnceHint")}
        </p>
      </div>
      <dl className="space-y-3 font-mono text-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <dt className="text-muted-foreground">client_id</dt>
            <dd className="mt-0.5 break-all text-foreground">{creds.clientId}</dd>
          </div>
          <CopyButton
            value={creds.clientId}
            label={t("copy")}
            copiedLabel={t("copied")}
          />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <dt className="text-muted-foreground">client_secret</dt>
            <dd className="mt-0.5 break-all text-foreground">
              {creds.clientSecret}
            </dd>
          </div>
          <CopyButton
            value={creds.clientSecret}
            label={t("copy")}
            copiedLabel={t("copied")}
          />
        </div>
      </dl>
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{t("envSnippet")}</span>
          <CopyButton
            value={envSnippet}
            label={t("copy")}
            copiedLabel={t("copied")}
          />
        </div>
        <pre className="overflow-x-auto rounded-lg border border-border bg-card p-3 text-[11px] leading-relaxed">
          {envSnippet}
        </pre>
      </div>
    </div>
  );
}

export default function AppsPage() {
  const { data } = useSession();
  const t = useTranslations("demo.domains");
  const title = useTranslations("demo");
  const { apps, loading, activeAppId, setActiveAppId, refreshApps } =
    useActiveApp();

  const [addOpen, setAddOpen] = useState(false);
  const [domainInput, setDomainInput] = useState("");
  const [creating, setCreating] = useState(false);

  const [detailApp, setDetailApp] = useState<AppRow | null>(null);
  const [creds, setCreds] = useState<Creds | null>(null);
  const [deleteStep, setDeleteStep] = useState<DeleteStep>("idle");
  const [leaveStep, setLeaveStep] = useState<LeaveStep>("idle");
  const [confirmDomain, setConfirmDomain] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeDetail = useCallback(() => {
    setDetailApp(null);
    setCreds(null);
    setDeleteStep("idle");
    setLeaveStep("idle");
    setConfirmDomain("");
    setError(null);
  }, []);

  const openDetail = useCallback((app: AppRow) => {
    setDetailApp(app);
    setCreds(null);
    setDeleteStep("idle");
    setLeaveStep("idle");
    setConfirmDomain("");
    setError(null);
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!data?.apiToken || !domainInput.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await apiFetch<Creds>("/v1/apps", {
        method: "POST",
        token: data.apiToken,
        body: JSON.stringify({ domain: domainInput.trim() }),
      });
      setActiveAppId(res.app.id);
      await refreshApps();
      setAddOpen(false);
      setDomainInput("");
      setDetailApp({
        id: res.app.id,
        domain: res.app.domain,
        name: res.app.name,
        role: res.app.role ?? "owner",
        clientId: res.clientId,
      });
      setCreds(res);
      setDeleteStep("idle");
      setLeaveStep("idle");
    } catch (err) {
      const code = err instanceof ApiError ? err.code : undefined;
      setError(
        code === "DOMAIN_IN_USE"
          ? t("domainInUse")
          : code === "DOMAIN_ALREADY_YOURS"
            ? t("domainAlreadyYours")
            : code === "DOMAIN_ALREADY_REGISTERED"
              ? t("domainInUse")
              : err instanceof Error
                ? err.message
                : t("createFailed"),
      );
    } finally {
      setCreating(false);
    }
  }

  async function onRotate() {
    if (!data?.apiToken || !detailApp) return;
    if (detailApp.role !== "owner") return;
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch<Creds>(
        `/v1/apps/${detailApp.id}/rotate-secret`,
        { method: "POST", token: data.apiToken },
      );
      setCreds(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("rotateFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!data?.apiToken || !detailApp) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/v1/apps/${detailApp.id}`, {
        method: "DELETE",
        token: data.apiToken,
        body: JSON.stringify({ domain: confirmDomain.trim() }),
      });
      const deletedId = detailApp.id;
      closeDetail();
      if (activeAppId === deletedId) setActiveAppId(null);
      await refreshApps();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("deleteFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function onLeave() {
    if (!data?.apiToken || !detailApp) return;
    if (detailApp.role === "owner") return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/v1/apps/${detailApp.id}/leave`, {
        method: "POST",
        token: data.apiToken,
      });
      closeDetail();
      await refreshApps();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("leaveFailed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AppHeader title={title("titles.domains")} />
      <main className="min-h-0 flex-1 space-y-6 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {title("titles.domains")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("pageHint")}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setDomainInput("");
              setAddOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            {t("add")}
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground">{t("loading")}</p>
          ) : apps.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground">{t("empty")}</p>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Plus className="h-4 w-4" />
                {t("add")}
              </button>
            </div>
          ) : (
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
                {apps.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-medium md:px-4 md:py-3">
                      {a.domain}
                    </td>
                    <td className="hidden px-3 py-2 font-mono text-[11px] text-muted-foreground md:table-cell md:px-4 md:py-3 md:text-xs">
                      {a.clientId ?? a.id}
                    </td>
                    <td className="px-3 py-2 capitalize md:px-4 md:py-3">
                      {a.role}
                    </td>
                    <td className="px-3 py-2 text-right md:px-4 md:py-3">
                      <button
                        type="button"
                        onClick={() => openDetail(a)}
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
          )}
        </div>
      </main>

      {/* Add domain sheet */}
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
          {error && addOpen && (
            <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
              {error}
            </p>
          )}
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
              disabled={creating}
              className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {creating ? t("creating") : t("add")}
            </button>
          </div>
        </form>
      </Sheet>

      {/* Detail / secret / delete sheet */}
      <Sheet
        open={Boolean(detailApp)}
        onClose={closeDetail}
        title={detailApp?.domain ?? t("details")}
        description={t("detailsHint")}
        wide
      >
        {detailApp && (
          <div className="space-y-6">
            <dl className="divide-y divide-border rounded-xl border border-border">
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{t("name")}</dt>
                <dd className="font-medium">{detailApp.domain}</dd>
              </div>
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">client_id</dt>
                <dd className="flex min-w-0 items-center gap-2 font-mono text-xs">
                  <span className="truncate">{detailApp.clientId ?? detailApp.id}</span>
                  <CopyButton
                    value={detailApp.clientId ?? detailApp.id}
                    label={t("copy")}
                    copiedLabel={t("copied")}
                  />
                </dd>
              </div>
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{t("role")}</dt>
                <dd className="capitalize font-medium">{detailApp.role}</dd>
              </div>
            </dl>

            {creds && <CredsBlock creds={creds} t={t} />}

            {!creds && (
              <p className="text-sm text-muted-foreground">{t("secretHidden")}</p>
            )}

            {(detailApp.role === "owner" || detailApp.role === "admin") && (
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void onRotate()}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-60"
                >
                  {t("rotate")}
                </button>
                <p className="text-xs text-muted-foreground">{t("rotateHint")}</p>
              </div>
            )}

            {error && detailApp && (
              <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
                {error}
              </p>
            )}

            {(detailApp.role === "admin" || detailApp.role === "viewer") && (
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-danger">{t("leave")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("leaveHint")}
                </p>

                {leaveStep === "idle" && (
                  <button
                    type="button"
                    onClick={() => setLeaveStep("confirm")}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("leave")}
                  </button>
                )}

                {leaveStep === "confirm" && (
                  <div className="mt-4 space-y-3 rounded-xl border border-danger/25 bg-danger/5 p-4">
                    <p className="text-sm font-medium text-foreground">
                      {t("leaveConfirmAsk")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("leaveConfirmWarn")}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setLeaveStep("idle")}
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void onLeave()}
                        className="flex-1 rounded-lg bg-danger px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {busy ? t("leaving") : t("leaveConfirm")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {detailApp.role === "owner" && (
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-danger">{t("dangerZone")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("deleteHint")}
                </p>

                {deleteStep === "idle" && (
                  <button
                    type="button"
                    onClick={() => setDeleteStep("confirm")}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("delete")}
                  </button>
                )}

                {deleteStep === "confirm" && (
                  <div className="mt-4 space-y-3 rounded-xl border border-danger/25 bg-danger/5 p-4">
                    <p className="text-sm font-medium text-foreground">
                      {t("deleteConfirmAsk")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("deleteConfirmWarn")}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDeleteStep("idle")}
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDomain("");
                          setDeleteStep("type");
                        }}
                        className="flex-1 rounded-lg bg-danger px-3 py-2 text-sm font-semibold text-white"
                      >
                        {t("deleteContinue")}
                      </button>
                    </div>
                  </div>
                )}

                {deleteStep === "type" && (
                  <div className="mt-4 space-y-3 rounded-xl border border-danger/25 bg-danger/5 p-4">
                    <p className="text-sm font-medium">
                      {t("deleteTypeAsk", { domain: detailApp.domain })}
                    </p>
                    <input
                      value={confirmDomain}
                      onChange={(e) => setConfirmDomain(e.target.value)}
                      placeholder={detailApp.domain}
                      autoFocus
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-danger/30"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteStep("confirm");
                          setConfirmDomain("");
                        }}
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        {t("back")}
                      </button>
                      <button
                        type="button"
                        disabled={
                          busy ||
                          confirmDomain.trim().toLowerCase() !==
                            detailApp.domain.toLowerCase()
                        }
                        onClick={() => void onDelete()}
                        className={cn(
                          "flex-1 rounded-lg bg-danger px-3 py-2 text-sm font-semibold text-white disabled:opacity-40",
                        )}
                      >
                        {busy ? t("deleting") : t("deleteForever")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Sheet>
    </>
  );
}

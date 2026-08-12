"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { Link } from "@/i18n/navigation";
import { Check, Copy, LogOut } from "lucide-react";

type MeResponse = {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    locale?: string | null;
    createdAt?: string | null;
  };
  accounts: { provider: string; providerAccountId: string }[];
};

function CopyId({
  value,
  copyLabel,
  copiedLabel,
}: {
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-primary"
      aria-label={copyLabel}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-primary" />
          {copiedLabel}
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {copyLabel}
        </>
      )}
    </button>
  );
}

function providerLabel(provider: string) {
  if (provider === "google") return "Google";
  if (provider === "telegram") return "Telegram";
  return provider;
}

function formatMemberSince(iso: string | null | undefined, locale: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat(locale === "uz" ? "uz-UZ" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export default function SettingsPage() {
  const { data } = useSession();
  const t = useTranslations("demo");
  const ts = useTranslations("demo.settings");
  const locale = useLocale();
  const { apps, loading: appsLoading } = useActiveApp();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  useEffect(() => {
    if (!data?.apiToken) return;
    setLoadingMe(true);
    apiFetch<MeResponse>("/v1/auth/me", { token: data.apiToken })
      .then(setMe)
      .catch(console.error)
      .finally(() => setLoadingMe(false));
  }, [data?.apiToken]);

  const name = me?.user.name ?? data?.user?.name ?? null;
  const email = me?.user.email ?? data?.user?.email ?? null;
  const image = me?.user.image ?? data?.user?.image ?? null;
  const userId = me?.user.id ?? data?.user?.id ?? null;
  const accountLocale = (me?.user.locale ?? locale).toUpperCase();
  const memberSince = formatMemberSince(me?.user.createdAt, locale);
  const initials = (name?.[0] ?? email?.[0] ?? "U").toUpperCase();
  const accounts = me?.accounts ?? [];

  return (
    <>
      <AppHeader title={t("nav.settings")} />
      <main className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_80%_70%_at_15%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%)]"
          aria-hidden
        />

        <div className="relative mx-auto grid w-full max-w-5xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14 lg:py-10">
          {/* Identity column */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-start">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-primary-soft text-3xl font-semibold text-primary ring-4 ring-background sm:h-32 sm:w-32">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center">
                    {initials}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {ts("profile")}
                </p>
                <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
                  {name ?? ts("noName")}
                </h1>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {email ?? ts("noEmail")}
                </p>
                <p className="mt-3 max-w-[18rem] text-xs leading-relaxed text-muted-foreground">
                  {ts("profileHint")}
                </p>

                <button
                  type="button"
                  onClick={() => void signOut({ callbackUrl: "/" })}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-danger"
                >
                  <LogOut className="h-4 w-4" />
                  {t("account.logout")}
                </button>
              </div>
            </div>
          </aside>

          {/* Detail column */}
          <div className="min-w-0 space-y-12">
            {/* Stat strip — typographic, no cards */}
            <section className="grid grid-cols-3 gap-4 border-y border-border py-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {ts("domains")}
                </p>
                <Link
                  href="/app/domains"
                  className="mt-1 block text-3xl font-semibold tabular-nums tracking-tight text-foreground transition hover:text-primary"
                >
                  {appsLoading ? "—" : apps.length}
                </Link>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {ts("locale")}
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {accountLocale}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {ts("provider")}
                </p>
                <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
                  {loadingMe && !me ? "—" : accounts.length}
                </p>
              </div>
            </section>

            {/* Account details */}
            <section>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                {ts("profile")}
              </h2>
              {loadingMe && !me ? (
                <p className="mt-4 text-sm text-muted-foreground">{ts("loading")}</p>
              ) : (
                <dl className="mt-4 divide-y divide-border">
                  <div className="grid gap-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-baseline sm:gap-6">
                    <dt className="text-sm text-muted-foreground">{ts("name")}</dt>
                    <dd className="text-sm font-medium">{name ?? "—"}</dd>
                  </div>
                  <div className="grid gap-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-baseline sm:gap-6">
                    <dt className="text-sm text-muted-foreground">{ts("email")}</dt>
                    <dd className="break-all text-sm font-medium">{email ?? "—"}</dd>
                  </div>
                  <div className="grid gap-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-start sm:gap-6">
                    <dt className="text-sm text-muted-foreground">{ts("userId")}</dt>
                    <dd className="flex min-w-0 flex-wrap items-center gap-3">
                      {userId ? (
                        <>
                          <code className="truncate font-mono text-xs text-foreground/80">
                            {userId}
                          </code>
                          <CopyId
                            value={userId}
                            copyLabel={ts("copy")}
                            copiedLabel={ts("copied")}
                          />
                        </>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                  <div className="grid gap-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-baseline sm:gap-6">
                    <dt className="text-sm text-muted-foreground">
                      {ts("memberSince")}
                    </dt>
                    <dd className="text-sm font-medium">{memberSince ?? "—"}</dd>
                  </div>
                </dl>
              )}
            </section>

            {/* Linked accounts */}
            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight">
                    {ts("linked")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {ts("linkedHint")}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-0">
                {accounts.map((a) => (
                  <li
                    key={`${a.provider}-${a.providerAccountId}`}
                    className="flex flex-col gap-2 border-l-2 border-primary/40 py-4 pl-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {providerLabel(a.provider)}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {ts("providerId")}
                      </p>
                    </div>
                    <div className="flex min-w-0 items-center gap-3">
                      <code className="max-w-[16rem] truncate font-mono text-xs text-muted-foreground">
                        {a.providerAccountId}
                      </code>
                      <CopyId
                        value={a.providerAccountId}
                        copyLabel={ts("copy")}
                        copiedLabel={ts("copied")}
                      />
                    </div>
                  </li>
                ))}
                {!loadingMe && accounts.length === 0 && (
                  <li className="py-4 text-sm text-muted-foreground">
                    {ts("noAccounts")}
                  </li>
                )}
              </ul>
            </section>

            {/* Language only — interaction control */}
            <section className="border-t border-border pt-8">
              <h2 className="text-sm font-semibold tracking-tight">
                {ts("preferences")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{ts("language")}</p>
              <div className="mt-4 max-w-[12rem]">
                <LanguageSelect className="w-full" />
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

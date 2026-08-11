"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Activity, ArrowLeft } from "lucide-react";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    onTelegramAuth?: (user: Record<string, string>) => void;
  }
}

export default function LoginPage() {
  const t = useTranslations("login");
  const locale = useLocale();
  const { data: session, status } = useSession();
  const router = useRouter();
  const tgRef = useRef<HTMLDivElement>(null);
  const appCallback = `/${locale}/app`;
  const [botName, setBotName] = useState(
    () => process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "",
  );
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "sync") {
      setSyncError(true);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    // Ready for dashboard
    if (session?.apiToken) {
      router.replace("/app");
      return;
    }

    // Session without API token → break redirect loop
    if (session?.error === "SyncError" || !session?.apiToken) {
      setSyncError(true);
      void signOut({ redirect: false });
    }
  }, [status, session, router]);

  useEffect(() => {
    if (botName) return;
    void fetch("/api/debug/social-env")
      .then((r) => r.json())
      .then(
        (env: {
          TELEGRAM_BOT_NAME?: string | null;
          NEXT_PUBLIC_TELEGRAM_BOT_NAME?: string | null;
        }) => {
          const name =
            env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || env.TELEGRAM_BOT_NAME || "";
          if (name) setBotName(name);
        },
      )
      .catch(() => {});
  }, [botName]);

  useEffect(() => {
    window.onTelegramAuth = (user) => {
      void signIn("telegram", {
        ...user,
        redirect: true,
        callbackUrl: appCallback,
      });
    };

    if (!botName || !tgRef.current) return;
    tgRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    tgRef.current.appendChild(script);

    return () => {
      delete window.onTelegramAuth;
    };
  }, [appCallback, botName]);

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 0%, var(--hero-glow), transparent 60%),
            radial-gradient(ellipse 40% 30% at 80% 80%, var(--hero-glow-2), transparent 55%)
          `,
        }}
      />
      <div className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </span>
          tashrif.info
        </Link>
        <LanguageSelect />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("sub")}</p>

          {syncError && (
            <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
              Login OK, but API sync failed. Check UI{" "}
              <code className="text-xs">API_URL</code> can reach the API (
              <code className="text-xs">/v1/auth/sync</code>).
            </p>
          )}

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: appCallback })}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-muted"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#4285F4]" />
              {t("google")}
            </button>

            <div className="flex justify-center py-2" ref={tgRef}>
              {!botName && (
                <p className="text-center text-xs text-muted-foreground">
                  {t("telegram")} — set TELEGRAM_BOT_NAME /
                  NEXT_PUBLIC_TELEGRAM_BOT_NAME
                </p>
              )}
            </div>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>
        </div>
      </div>
    </div>
  );
}

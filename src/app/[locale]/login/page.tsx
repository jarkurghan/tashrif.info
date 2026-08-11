"use client";

import { signIn, useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Activity, ArrowLeft } from "lucide-react";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    onTelegramAuth?: (user: Record<string, string>) => void;
  }
}

export default function LoginPage() {
  const t = useTranslations("login");
  const locale = useLocale();
  const { status } = useSession();
  const router = useRouter();
  const tgRef = useRef<HTMLDivElement>(null);
  const appCallback = `/${locale}/app`;

  useEffect(() => {
    if (status === "authenticated") router.replace("/app");
  }, [status, router]);

  useEffect(() => {
    window.onTelegramAuth = (user) => {
      void signIn("telegram", {
        ...user,
        redirect: true,
        callbackUrl: appCallback,
      });
    };

    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;
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
  }, [appCallback]);

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
              {!process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME && (
                <p className="text-center text-xs text-muted-foreground">
                  {t("telegram")} — set NEXT_PUBLIC_TELEGRAM_BOT_NAME
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

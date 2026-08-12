"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { cn } from "@/lib/cn";
import { Send } from "lucide-react";

type Integration = {
  id: string;
  chatId: string;
  randomId: string;
  title: string | null;
  schedule: "daily" | "weekly" | "monthly";
  active: boolean;
};

export default function ReportsPage() {
  const { activeAppId: appId } = useActiveApp();
  const { data } = useSession();
  const t = useTranslations("demo.reports");
  const title = useTranslations("demo");
  const [chatId, setChatId] = useState("");
  const [randomId, setRandomId] = useState("");
  const [schedule, setSchedule] = useState<"daily" | "weekly" | "monthly">("daily");
  const [list, setList] = useState<Integration[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!data?.apiToken || !appId) return;
    const res = await apiFetch<{ integrations: Integration[] }>(
      `/v1/apps/${appId}/telegram`,
      { token: data.apiToken },
    );
    setList(res.integrations);
  }

  useEffect(() => {
    void load().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.apiToken, appId]);

  async function integrate(e: React.FormEvent) {
    e.preventDefault();
    if (!data?.apiToken) return;
    setError(null);
    try {
      await apiFetch(`/v1/apps/${appId}/telegram`, {
        method: "POST",
        token: data.apiToken,
        body: JSON.stringify({ chatId, randomId, schedule }),
      });
      setChatId("");
      setRandomId("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <>
      <AppHeader title={title("titles.reports")} />
      <main className="mx-auto grid max-w-4xl flex-1 gap-6 p-4 sm:p-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("sub")}</p>
          <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
            {t("hint")}
          </p>
          <form onSubmit={integrate} className="mt-5 space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">{t("chatId")}</span>
              <input
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">{t("randomId")}</span>
              <input
                value={randomId}
                onChange={(e) => setRandomId(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {(["daily", "weekly", "monthly"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSchedule(s)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm",
                    schedule === s
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {t(s)}
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-accent">{error}</p>}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <Send className="h-4 w-4" />
              {t("integrate")}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold">{t("connected")}</h3>
          <ul className="mt-4 space-y-3">
            {list.length === 0 && (
              <li className="text-sm text-muted-foreground">None yet</li>
            )}
            {list.map((chat) => (
              <li
                key={chat.id}
                className="rounded-lg border border-border bg-muted/30 px-4 py-3"
              >
                <p className="font-medium">{chat.title ?? chat.chatId}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {chat.chatId}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-primary">
                  {t(chat.schedule)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}

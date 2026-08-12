"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { Sheet } from "@/components/ui/Sheet";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { Eye, Plus, Trash2 } from "lucide-react";

type Schedule = "daily" | "weekly" | "monthly";

type Report = {
  id: string;
  schedule: Schedule;
  active: boolean;
  lastSentAt: string | null;
  createdAt: string;
};

type Chat = {
  id: string;
  chatId: string;
  randomId: string;
  title: string | null;
  active: boolean;
  createdAt: string;
  reports: Report[];
};

const SCHEDULES: Schedule[] = ["daily", "weekly", "monthly"];

export default function ReportsPage() {
  const { activeAppId: appId } = useActiveApp();
  const { data } = useSession();
  const t = useTranslations("demo.reports");
  const title = useTranslations("demo");

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [linkOpen, setLinkOpen] = useState(false);
  const [chatId, setChatId] = useState("");
  const [randomId, setRandomId] = useState("");
  const [linking, setLinking] = useState(false);

  const [detailChat, setDetailChat] = useState<Chat | null>(null);
  const [schedule, setSchedule] = useState<Schedule>("daily");
  const [addingReport, setAddingReport] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!data?.apiToken || !appId) return;
    setLoading(true);
    try {
      const res = await apiFetch<{ chats: Chat[] }>(
        `/v1/apps/${appId}/telegram`,
        { token: data.apiToken },
      );
      setChats(res.chats);
      setDetailChat((prev) =>
        prev ? (res.chats.find((c) => c.id === prev.id) ?? null) : null,
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [data?.apiToken, appId]);

  useEffect(() => {
    void load();
  }, [load]);

  function openDetail(chat: Chat) {
    setDetailChat(chat);
    setSchedule("daily");
    setError(null);
  }

  function closeDetail() {
    setDetailChat(null);
    setError(null);
  }

  async function linkChat(e: React.FormEvent) {
    e.preventDefault();
    if (!data?.apiToken || !appId) return;
    setLinking(true);
    setError(null);
    try {
      const res = await apiFetch<{ chat: Chat }>(
        `/v1/apps/${appId}/telegram/chats`,
        {
          method: "POST",
          token: data.apiToken,
          body: JSON.stringify({ chatId, randomId }),
        },
      );
      setChatId("");
      setRandomId("");
      setLinkOpen(false);
      await load();
      openDetail(res.chat);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLinking(false);
    }
  }

  async function unlinkChat() {
    if (!data?.apiToken || !appId || !detailChat) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/v1/apps/${appId}/telegram/chats/${detailChat.id}`, {
        method: "DELETE",
        token: data.apiToken,
      });
      closeDetail();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function addReport(e: React.FormEvent) {
    e.preventDefault();
    if (!data?.apiToken || !appId || !detailChat) return;
    setAddingReport(true);
    setError(null);
    try {
      await apiFetch(
        `/v1/apps/${appId}/telegram/chats/${detailChat.id}/reports`,
        {
          method: "POST",
          token: data.apiToken,
          body: JSON.stringify({ schedule }),
        },
      );
      setSchedule("daily");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setAddingReport(false);
    }
  }

  async function deleteReport(reportId: string) {
    if (!data?.apiToken || !appId || !detailChat) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(
        `/v1/apps/${appId}/telegram/chats/${detailChat.id}/reports/${reportId}`,
        { method: "DELETE", token: data.apiToken },
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  const availableSchedules = SCHEDULES.filter(
    (s) => !detailChat?.reports.some((r) => r.schedule === s),
  );

  return (
    <>
      <AppHeader title={title("titles.reports")} />
      <main className="min-h-0 flex-1 space-y-6 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {t("connected")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("sub")}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setChatId("");
              setRandomId("");
              setLinkOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            {t("linkChat")}
          </button>
        </div>

        {error && !linkOpen && !detailChat && (
          <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
            {error}
          </p>
        )}

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground">{t("loading")}</p>
          ) : chats.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground">{t("empty")}</p>
              <button
                type="button"
                onClick={() => setLinkOpen(true)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Plus className="h-4 w-4" />
                {t("linkChat")}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t("chat")}</th>
                    <th className="px-4 py-3 font-medium">Chat ID</th>
                    <th className="px-4 py-3 font-medium">{t("reportsCol")}</th>
                    <th className="px-4 py-3 font-medium text-right">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {chats.map((chat) => (
                    <tr key={chat.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">
                        {chat.title ?? chat.chatId}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {chat.chatId}
                      </td>
                      <td className="px-4 py-3">
                        {chat.reports.length === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {chat.reports.map((r) => (
                              <span
                                key={r.id}
                                className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary"
                              >
                                {t(r.schedule)}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openDetail(chat)}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
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

      <Sheet
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title={t("linkChat")}
        description={t("hint")}
      >
        <form onSubmit={linkChat} className="flex h-full flex-col gap-5">
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">
              {t("chatId")}
            </span>
            <input
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="-1002145987632"
              required
              autoFocus
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring/40"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">
              {t("randomId")}
            </span>
            <input
              value={randomId}
              onChange={(e) => setRandomId(e.target.value)}
              placeholder="a7f3c9e2b1"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring/40"
            />
          </label>
          {error && linkOpen && (
            <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
              {error}
            </p>
          )}
          <div className="mt-auto flex gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setLinkOpen(false)}
              className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={linking}
              className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {linking ? t("linking") : t("link")}
            </button>
          </div>
        </form>
      </Sheet>

      <Sheet
        open={Boolean(detailChat)}
        onClose={closeDetail}
        title={detailChat?.title ?? detailChat?.chatId ?? t("details")}
        description={t("detailsHint")}
        wide
      >
        {detailChat && (
          <div className="space-y-6">
            <dl className="divide-y divide-border rounded-xl border border-border">
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{t("chat")}</dt>
                <dd className="font-medium text-right">
                  {detailChat.title ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">Chat ID</dt>
                <dd className="font-mono text-xs text-right">
                  {detailChat.chatId}
                </dd>
              </div>
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{t("reportsCol")}</dt>
                <dd className="font-medium">{detailChat.reports.length}</dd>
              </div>
            </dl>

            <div>
              <h3 className="text-sm font-semibold">{t("reportsCol")}</h3>
              <div className="mt-3 overflow-hidden rounded-xl border border-border">
                {detailChat.reports.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    {t("noReports")}
                  </p>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2.5 font-medium">
                          {t("schedule")}
                        </th>
                        <th className="px-4 py-2.5 font-medium text-right" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {detailChat.reports.map((r) => (
                        <tr key={r.id}>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary">
                              {t(r.schedule)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void deleteReport(r.id)}
                              className="text-muted-foreground hover:text-danger disabled:opacity-60"
                            >
                              {t("deleteReport")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {availableSchedules.length > 0 && (
              <form
                onSubmit={addReport}
                className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:flex-row sm:items-end"
              >
                <label className="flex-1 text-sm">
                  <span className="mb-1.5 block text-muted-foreground">
                    {t("schedule")}
                  </span>
                  <Select
                    aria-label={t("schedule")}
                    value={
                      availableSchedules.includes(schedule)
                        ? schedule
                        : availableSchedules[0]
                    }
                    onChange={(v) => setSchedule(v as Schedule)}
                    options={availableSchedules.map((s) => ({
                      value: s,
                      label: t(s),
                    }))}
                  />
                </label>
                <button
                  type="submit"
                  disabled={addingReport}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  {addingReport ? t("saving") : t("addReport")}
                </button>
              </form>
            )}

            {availableSchedules.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {t("allSchedulesUsed")}
              </p>
            )}

            {error && detailChat && (
              <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
                {error}
              </p>
            )}

            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-danger">
                {t("dangerZone")}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("unlinkHint")}
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void unlinkChat()}
                className={cn(
                  "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:opacity-60",
                )}
              >
                <Trash2 className="h-4 w-4" />
                {busy ? t("unlinking") : t("unlink")}
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}

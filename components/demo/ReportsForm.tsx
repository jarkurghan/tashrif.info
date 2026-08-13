"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  reportChats as seed,
  type ReportChat,
  type ReportKind,
  type ReportSchedule,
} from "@/lib/demo-data";
import { Sheet } from "@/components/ui/Sheet";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { Eye, Plus, Trash2 } from "lucide-react";

const SCHEDULES: ReportSchedule[] = ["daily", "weekly", "monthly"];
const KINDS: ReportKind[] = ["stats", "log", "traffic"];

function pairKey(schedule: ReportSchedule, kind: ReportKind) {
  return `${schedule}:${kind}`;
}

export function ReportsForm() {
  const t = useTranslations("demo.reports");
  const [chats, setChats] = useState(seed);
  const [linkOpen, setLinkOpen] = useState(false);
  const [chatId, setChatId] = useState("");
  const [randomId, setRandomId] = useState("");
  const [detail, setDetail] = useState<ReportChat | null>(null);
  const [schedule, setSchedule] = useState<ReportSchedule>("daily");
  const [kind, setKind] = useState<ReportKind>("stats");

  const usedPairs = useMemo(() => {
    return new Set(
      (detail?.reports ?? []).map((r) => pairKey(r.schedule, r.kind)),
    );
  }, [detail]);

  const availableSchedules = SCHEDULES.filter((s) =>
    KINDS.some((k) => !usedPairs.has(pairKey(s, k))),
  );
  const availableKinds = KINDS.filter(
    (k) => !usedPairs.has(pairKey(schedule, k)),
  );
  const hasAvailable = availableSchedules.length > 0;

  function openDetail(chat: ReportChat) {
    setDetail(chat);
    const used = new Set(chat.reports.map((r) => pairKey(r.schedule, r.kind)));
    const first = SCHEDULES.flatMap((s) =>
      KINDS.map((k) => ({ schedule: s, kind: k })),
    ).find((p) => !used.has(pairKey(p.schedule, p.kind)));
    setSchedule(first?.schedule ?? "daily");
    setKind(first?.kind ?? "stats");
  }

  function linkChat(e: React.FormEvent) {
    e.preventDefault();
    const next: ReportChat = {
      id: `chat_${Date.now()}`,
      name: "Yangi chat",
      chatId: chatId.trim(),
      reports: [],
    };
    setChats((prev) => [next, ...prev]);
    setChatId("");
    setRandomId("");
    setLinkOpen(false);
    openDetail(next);
  }

  function addReport(e: React.FormEvent) {
    e.preventDefault();
    if (!detail) return;
    const report = {
      id: `r_${Date.now()}`,
      schedule,
      kind,
    };
    const updated = {
      ...detail,
      reports: [...detail.reports, report],
    };
    setChats((prev) => prev.map((c) => (c.id === detail.id ? updated : c)));
    setDetail(updated);
  }

  function deleteReport(id: string) {
    if (!detail) return;
    const updated = {
      ...detail,
      reports: detail.reports.filter((r) => r.id !== id),
    };
    setChats((prev) => prev.map((c) => (c.id === detail.id ? updated : c)));
    setDetail(updated);
  }

  function unlink() {
    if (!detail) return;
    setChats((prev) => prev.filter((c) => c.id !== detail.id));
    setDetail(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {t("connected")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("sub")}</p>
        </div>
        <button
          type="button"
          onClick={() => setLinkOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          {t("linkChat")}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground md:text-xs">
              <tr>
                <th className="px-3 py-2.5 font-medium md:px-4 md:py-3">
                  {t("chat")}
                </th>
                <th className="hidden px-3 py-2.5 font-medium md:table-cell md:px-4 md:py-3">
                  Chat ID
                </th>
                <th className="px-3 py-2.5 font-medium md:px-4 md:py-3">
                  {t("reportsCol")}
                </th>
                <th className="px-3 py-2.5 text-right font-medium md:px-4 md:py-3">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {chats.map((chat) => (
                <tr key={chat.id} className="hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium md:px-4 md:py-3">
                    {chat.name}
                    <span className="mt-0.5 block font-mono text-[11px] font-normal text-muted-foreground md:hidden">
                      {chat.chatId}
                    </span>
                  </td>
                  <td className="hidden px-3 py-2 font-mono text-[11px] text-muted-foreground md:table-cell md:px-4 md:py-3 md:text-xs">
                    {chat.chatId}
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    {chat.reports.length === 0 ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {chat.reports.map((r) => (
                          <span
                            key={r.id}
                            className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] text-primary md:text-xs"
                          >
                            {t(r.schedule)} · {t(r.kind)}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right md:px-4 md:py-3">
                    <button
                      type="button"
                      onClick={() => openDetail(chat)}
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
      </div>

      <Sheet
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title={t("linkChat")}
        description={t("hint")}
      >
        <form onSubmit={linkChat} className="flex h-full flex-col gap-5">
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">{t("chatId")}</span>
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
              className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {t("link")}
            </button>
          </div>
        </form>
      </Sheet>

      <Sheet
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.name ?? t("details")}
        description={t("detailsHint")}
        wide
      >
        {detail && (
          <div className="space-y-6">
            <dl className="divide-y divide-border rounded-xl border border-border">
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{t("chat")}</dt>
                <dd className="font-medium">{detail.name}</dd>
              </div>
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">Chat ID</dt>
                <dd className="font-mono text-xs">{detail.chatId}</dd>
              </div>
              <div className="flex justify-between gap-3 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{t("reportsCol")}</dt>
                <dd className="font-medium">{detail.reports.length}</dd>
              </div>
            </dl>

            <div>
              <h3 className="text-sm font-semibold">{t("reportsCol")}</h3>
              <div className="mt-3 overflow-hidden rounded-xl border border-border">
                {detail.reports.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    {t("noReports")}
                  </p>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2.5 font-medium">{t("schedule")}</th>
                        <th className="px-4 py-2.5 font-medium">{t("kind")}</th>
                        <th className="px-4 py-2.5 font-medium text-right" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {detail.reports.map((r) => (
                        <tr key={r.id}>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary">
                              {t(r.schedule)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                              {t(r.kind)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => deleteReport(r.id)}
                              className="text-muted-foreground hover:text-danger"
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

            {hasAvailable && (
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
                    onChange={(v) => setSchedule(v as ReportSchedule)}
                    options={availableSchedules.map((s) => ({
                      value: s,
                      label: t(s),
                    }))}
                  />
                </label>
                <label className="flex-1 text-sm">
                  <span className="mb-1.5 block text-muted-foreground">
                    {t("kind")}
                  </span>
                  <Select
                    aria-label={t("kind")}
                    value={
                      availableKinds.includes(kind) ? kind : availableKinds[0]
                    }
                    onChange={(v) => setKind(v as ReportKind)}
                    options={availableKinds.map((k) => ({
                      value: k,
                      label: t(k),
                    }))}
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
                >
                  <Plus className="h-4 w-4" />
                  {t("addReport")}
                </button>
              </form>
            )}

            {!hasAvailable && (
              <p className="text-sm text-muted-foreground">
                {t("allSchedulesUsed")}
              </p>
            )}

            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-danger">
                {t("dangerZone")}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">{t("unlinkHint")}</p>
              <button
                type="button"
                onClick={unlink}
                className={cn(
                  "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10",
                )}
              >
                <Trash2 className="h-4 w-4" />
                {t("unlink")}
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}

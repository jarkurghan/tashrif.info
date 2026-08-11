"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { reportChats } from "@/lib/demo-data";
import { cn } from "@/lib/cn";
import { Send } from "lucide-react";

export function ReportsForm() {
  const t = useTranslations("demo.reports");
  const [schedule, setSchedule] = useState<"daily" | "weekly" | "monthly">("daily");

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("sub")}</p>
        <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
          {t("hint")}
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">{t("chatId")}</span>
            <input
              name="chatId"
              placeholder="-1002145987632"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring/40"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">{t("randomId")}</span>
            <input
              name="randomId"
              placeholder="a7f3c9e2b1"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring/40"
            />
          </label>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">{t("schedule")}</p>
            <div className="flex flex-wrap gap-2">
              {(["daily", "weekly", "monthly"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSchedule(s)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition",
                    schedule === s
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(s)}
                </button>
              ))}
            </div>
          </div>

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
          {reportChats.map((chat) => (
            <li
              key={chat.chatId}
              className="rounded-lg border border-border bg-muted/30 px-4 py-3"
            >
              <p className="font-medium">{chat.name}</p>
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
    </div>
  );
}

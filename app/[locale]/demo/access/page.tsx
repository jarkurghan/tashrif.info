"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { accessRows as seed } from "@/lib/demo-data";
import { Sheet } from "@/components/ui/Sheet";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { UserPlus } from "lucide-react";

type Row = (typeof seed)[number];

export default function AccessPage() {
  const t = useTranslations("demo.access");
  const title = useTranslations("demo");
  const [rows, setRows] = useState(seed);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "viewer">("viewer");

  function onInvite(e: React.FormEvent) {
    e.preventDefault();
    const next: Row = {
      email: email.trim(),
      role,
      status: "pending",
      invitedAt: new Date().toISOString().slice(0, 10),
    };
    setRows((prev) => [...prev, next]);
    setInviteOpen(false);
    setEmail("");
    setRole("viewer");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {title("titles.access")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("pageHint")}</p>
        </div>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
        >
          <UserPlus className="h-4 w-4" />
          {t("invite")}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground md:text-xs">
              <tr>
                <th className="px-3 py-2.5 font-medium md:px-4 md:py-3">
                  {t("email")}
                </th>
                <th className="px-3 py-2.5 font-medium md:px-4 md:py-3">
                  {t("role")}
                </th>
                <th className="hidden px-3 py-2.5 font-medium md:table-cell md:px-4 md:py-3">
                  {t("pending")}
                </th>
                <th className="px-3 py-2.5 font-medium text-right md:px-4 md:py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.email} className="hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium md:px-4 md:py-3">
                    <span className="inline-flex flex-wrap items-center gap-2">
                      {row.email}
                      {row.status === "pending" && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent md:hidden">
                          {t("pending")}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3">{t(row.role)}</td>
                  <td className="hidden px-3 py-2 md:table-cell md:px-4 md:py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        row.status === "accepted"
                          ? "bg-success-soft text-success"
                          : "bg-accent-soft text-accent",
                      )}
                    >
                      {t(row.status)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right md:px-4 md:py-3">
                    {row.role !== "owner" && (
                      <button
                        type="button"
                        onClick={() =>
                          setRows((prev) => prev.filter((r) => r.email !== row.email))
                        }
                        className="text-muted-foreground hover:text-danger"
                      >
                        {t("revoke")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title={t("invite")}
        description={t("inviteHint")}
      >
        <form onSubmit={onInvite} className="flex h-full flex-col gap-5">
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">{t("email")}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ism@bozor.uz"
              required
              autoFocus
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring/40"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">{t("role")}</span>
            <Select
              aria-label={t("role")}
              value={role}
              onChange={(v) => setRole(v as "admin" | "viewer")}
              options={[
                { value: "admin", label: t("admin") },
                { value: "viewer", label: t("viewer") },
              ]}
            />
          </label>
          <div className="mt-auto flex gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setInviteOpen(false)}
              className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {t("invite")}
            </button>
          </div>
        </form>
      </Sheet>
    </div>
  );
}

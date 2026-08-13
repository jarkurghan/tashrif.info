"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useInviteInbox } from "@/components/app/InviteInboxProvider";
import { IncomingInviteRow } from "@/components/app/IncomingInvites";
import { useTranslations } from "next-intl";
import { apiFetch, ApiError } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { UserPlus } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";

type Member = {
  userId: string;
  email: string | null;
  name: string | null;
  role: string;
  status: string;
};

type OutgoingInvite = {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
};

export default function AccessPage() {
  const { activeAppId: appId } = useActiveApp();
  const { invites } = useInviteInbox();
  const { data } = useSession();
  const t = useTranslations("demo.access");
  const title = useTranslations("demo");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [members, setMembers] = useState<Member[]>([]);
  const [outgoing, setOutgoing] = useState<OutgoingInvite[]>([]);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );
  const [sending, setSending] = useState(false);

  async function load() {
    if (!data?.apiToken || !appId) return;
    const res = await apiFetch<{
      members: Member[];
      invitations: OutgoingInvite[];
    }>(`/v1/apps/${appId}/members`, { token: data.apiToken });
    setMembers(res.members);
    setOutgoing(res.invitations);
  }

  useEffect(() => {
    void load().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.apiToken, appId]);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    if (!data?.apiToken || !appId) return;
    setMsg(null);
    setSending(true);
    try {
      await apiFetch(`/v1/apps/${appId}/invitations`, {
        method: "POST",
        token: data.apiToken,
        body: JSON.stringify({ email, role }),
      });
      setEmail("");
      setMsg({ kind: "ok", text: t("inviteCreated") });
      await load();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : undefined;
      const text =
        code === "USER_NOT_REGISTERED"
          ? t("notRegistered")
          : code === "ALREADY_MEMBER"
            ? t("alreadyMember")
            : code === "SELF_INVITE"
              ? t("selfInvite")
              : t("inviteFailed");
      setMsg({ kind: "err", text });
    } finally {
      setSending(false);
    }
  }

  async function revokeMember(userId: string) {
    if (!data?.apiToken || !appId) return;
    await apiFetch(`/v1/apps/${appId}/members/${userId}`, {
      method: "DELETE",
      token: data.apiToken,
    });
    await load();
  }

  async function cancelInvite(inviteId: string) {
    if (!data?.apiToken || !appId) return;
    await apiFetch(`/v1/apps/${appId}/invitations/${inviteId}`, {
      method: "DELETE",
      token: data.apiToken,
    });
    setMsg({ kind: "ok", text: t("inviteCancelled") });
    await load();
  }

  return (
    <>
      <AppHeader title={title("titles.access")} />
      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        {invites.length > 0 && (
          <section className="rounded-xl border border-accent/30 bg-accent-soft/60 p-4 shadow-sm">
            <h2 className="text-sm font-semibold">{t("incomingTitle")}</h2>
            <div className="mt-3 space-y-4">
              {invites.map((item) => (
                <IncomingInviteRow key={item.id} invite={item} />
              ))}
            </div>
          </section>
        )}

        <form
          onSubmit={invite}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-end"
        >
          <label className="flex-1 text-sm">
            <span className="mb-1.5 block text-muted-foreground">{t("email")}</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm sm:w-44">
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
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />
            {t("invite")}
          </button>
        </form>
        {msg && (
          <p
            className={cn(
              "text-sm",
              msg.kind === "err" ? "text-accent" : "text-muted-foreground",
            )}
          >
            {msg.text}
          </p>
        )}

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{t("email")}</th>
                <th className="px-4 py-3">{t("role")}</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.userId}>
                  <td className="px-4 py-3">{m.email ?? m.name}</td>
                  <td className="px-4 py-3">{t(m.role as "owner")}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs",
                        m.status === "accepted"
                          ? "bg-success-soft text-success"
                          : "bg-accent-soft text-accent",
                      )}
                    >
                      {t(m.status as "accepted")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {m.role !== "owner" && (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-danger"
                        onClick={() => void revokeMember(m.userId)}
                      >
                        {t("revoke")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {outgoing.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-3">{i.email}</td>
                  <td className="px-4 py-3">{t(i.role as "admin")}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">
                      {t("pending")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-danger"
                      onClick={() => void cancelInvite(i.id)}
                    >
                      {t("revoke")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

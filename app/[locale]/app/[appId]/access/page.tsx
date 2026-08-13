"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useInviteInbox } from "@/components/app/InviteInboxProvider";
import { IncomingInviteRow } from "@/components/app/IncomingInvites";
import { useTranslations } from "next-intl";
import { apiFetch, ApiError } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";
import { Sheet } from "@/components/ui/Sheet";
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

type RevokeTarget =
  | { kind: "member"; userId: string; email: string }
  | { kind: "invite"; inviteId: string; email: string };

export default function AccessPage() {
  const { activeAppId: appId, activeApp } = useActiveApp();
  const isOwner = activeApp?.role === "owner";
  const { invites } = useInviteInbox();
  const { data } = useSession();
  const t = useTranslations("demo.access");
  const title = useTranslations("demo");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [members, setMembers] = useState<Member[]>([]);
  const [outgoing, setOutgoing] = useState<OutgoingInvite[]>([]);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [roleMember, setRoleMember] = useState<Member | null>(null);
  const [editRole, setEditRole] = useState<"admin" | "viewer">("viewer");
  const [roleError, setRoleError] = useState<string | null>(null);
  const [roleSaving, setRoleSaving] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<RevokeTarget | null>(null);
  const [revoking, setRevoking] = useState(false);

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
    setInviteError(null);
    setSending(true);
    try {
      await apiFetch(`/v1/apps/${appId}/invitations`, {
        method: "POST",
        token: data.apiToken,
        body: JSON.stringify({ email, role }),
      });
      setEmail("");
      setRole("viewer");
      setInviteOpen(false);
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
      setInviteError(text);
    } finally {
      setSending(false);
    }
  }

  function openInvite() {
    setInviteError(null);
    setInviteOpen(true);
  }

  function openRole(member: Member) {
    if (member.role !== "admin" && member.role !== "viewer") return;
    setRoleError(null);
    setEditRole(member.role);
    setRoleMember(member);
  }

  async function saveRole(e: React.FormEvent) {
    e.preventDefault();
    if (!data?.apiToken || !appId || !roleMember) return;
    setRoleError(null);
    setRoleSaving(true);
    try {
      await apiFetch(`/v1/apps/${appId}/members/${roleMember.userId}`, {
        method: "PATCH",
        token: data.apiToken,
        body: JSON.stringify({ role: editRole }),
      });
      setRoleMember(null);
      setMsg({ kind: "ok", text: t("roleUpdated") });
      await load();
    } catch {
      setRoleError(t("roleUpdateFailed"));
    } finally {
      setRoleSaving(false);
    }
  }

  async function confirmRevoke() {
    if (!data?.apiToken || !appId || !revokeTarget) return;
    setRevoking(true);
    try {
      if (revokeTarget.kind === "member") {
        await apiFetch(`/v1/apps/${appId}/members/${revokeTarget.userId}`, {
          method: "DELETE",
          token: data.apiToken,
        });
      } else {
        await apiFetch(`/v1/apps/${appId}/invitations/${revokeTarget.inviteId}`, {
          method: "DELETE",
          token: data.apiToken,
        });
        setMsg({ kind: "ok", text: t("inviteCancelled") });
      }
      setRevokeTarget(null);
      await load();
    } catch {
      setMsg({ kind: "err", text: t("revokeFailed") });
    } finally {
      setRevoking(false);
    }
  }

  return (
    <>
      <AppHeader title={title("titles.access")} />
      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {title("titles.access")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("pageHint")}</p>
          </div>
          <button
            type="button"
            onClick={openInvite}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
          >
            <UserPlus className="h-4 w-4" />
            {t("invite")}
          </button>
        </div>

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
          <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground md:text-xs">
              <tr>
                <th className="px-3 py-2.5 md:px-4 md:py-3">{t("email")}</th>
                <th className="px-3 py-2.5 md:px-4 md:py-3">{t("role")}</th>
                <th className="hidden px-3 py-2.5 md:table-cell md:px-4 md:py-3">
                  Status
                </th>
                <th className="px-3 py-2.5 md:px-4 md:py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.userId}>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    <span className="inline-flex flex-wrap items-center gap-2">
                      {m.email ?? m.name}
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] md:hidden",
                          m.status === "accepted"
                            ? "bg-success-soft text-success"
                            : "bg-accent-soft text-accent",
                        )}
                      >
                        {t(m.status as "accepted")}
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    {isOwner && m.role !== "owner" ? (
                      <button
                        type="button"
                        className="font-medium text-primary hover:underline"
                        onClick={() => openRole(m)}
                      >
                        {t(m.role as "admin")}
                      </button>
                    ) : (
                      t(m.role as "owner")
                    )}
                  </td>
                  <td className="hidden px-3 py-2 md:table-cell md:px-4 md:py-3">
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
                  <td className="px-3 py-2 text-right md:px-4 md:py-3">
                    {isOwner && m.role !== "owner" && (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-danger"
                        onClick={() =>
                          setRevokeTarget({
                            kind: "member",
                            userId: m.userId,
                            email: m.email ?? m.name ?? m.userId,
                          })
                        }
                      >
                        {t("revoke")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {outgoing.map((i) => (
                <tr key={i.id}>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    <span className="inline-flex flex-wrap items-center gap-2">
                      {i.email}
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] text-accent md:hidden">
                        {t("pending")}
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    {t(i.role as "admin")}
                  </td>
                  <td className="hidden px-3 py-2 md:table-cell md:px-4 md:py-3">
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">
                      {t("pending")}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right md:px-4 md:py-3">
                    {isOwner && (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-danger"
                        onClick={() =>
                          setRevokeTarget({
                            kind: "invite",
                            inviteId: i.id,
                            email: i.email,
                          })
                        }
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
      </main>

      <Sheet
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title={t("invite")}
        description={t("inviteHint")}
      >
        <form onSubmit={invite} className="flex h-full flex-col gap-5">
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">{t("email")}</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
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
          {inviteError && (
            <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
              {inviteError}
            </p>
          )}
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
              disabled={sending}
              className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {sending ? t("sending") : t("invite")}
            </button>
          </div>
        </form>
      </Sheet>

      <Sheet
        open={Boolean(roleMember)}
        onClose={() => setRoleMember(null)}
        title={t("changeRole")}
        description={
          roleMember
            ? t("changeRoleHint", {
                email: roleMember.email ?? roleMember.name ?? "",
              })
            : undefined
        }
      >
        {roleMember && (
          <form onSubmit={saveRole} className="flex h-full flex-col gap-5">
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">
                {t("role")}
              </span>
              <Select
                aria-label={t("role")}
                value={editRole}
                onChange={(v) => setEditRole(v as "admin" | "viewer")}
                options={[
                  { value: "admin", label: t("admin") },
                  { value: "viewer", label: t("viewer") },
                ]}
              />
            </label>
            {roleError && (
              <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
                {roleError}
              </p>
            )}
            <div className="mt-auto flex gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setRoleMember(null)}
                className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={roleSaving || editRole === roleMember.role}
                className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {roleSaving ? t("saving") : t("save")}
              </button>
            </div>
          </form>
        )}
      </Sheet>

      <Sheet
        open={Boolean(revokeTarget)}
        onClose={() => setRevokeTarget(null)}
        title={
          revokeTarget?.kind === "invite"
            ? t("revokeInviteTitle")
            : t("revokeMemberTitle")
        }
        description={
          revokeTarget
            ? t(
                revokeTarget.kind === "invite"
                  ? "revokeInviteHint"
                  : "revokeMemberHint",
                { email: revokeTarget.email },
              )
            : undefined
        }
      >
        {revokeTarget && (
          <div className="flex h-full flex-col gap-5">
            <p className="text-sm">
              {revokeTarget.kind === "invite"
                ? t("revokeInviteConfirm")
                : t("revokeMemberConfirm")}
            </p>
            <div className="mt-auto flex gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setRevokeTarget(null)}
                className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                disabled={revoking}
                onClick={() => void confirmRevoke()}
                className="flex-1 rounded-lg bg-danger px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {revoking ? t("revoking") : t("revoke")}
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}

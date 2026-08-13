"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  useInviteInbox,
  type InboxInvite,
} from "@/components/app/InviteInboxProvider";
import { cn } from "@/lib/cn";

function roleLabel(
  t: ReturnType<typeof useTranslations>,
  role: string,
) {
  if (role === "admin" || role === "viewer" || role === "owner") {
    return t(role);
  }
  return role;
}

export function IncomingInviteRow({
  invite,
  compact = false,
}: {
  invite: InboxInvite;
  compact?: boolean;
}) {
  const t = useTranslations("demo.access");
  const router = useRouter();
  const { acceptInvite, declineInvite } = useInviteInbox();
  const [busy, setBusy] = useState<"accept" | "decline" | null>(null);

  const who = invite.invitedByName || invite.invitedByEmail || "—";

  async function onAccept() {
    setBusy("accept");
    try {
      const appId = await acceptInvite(invite.id);
      if (appId) router.push(`/app/${appId}/access`);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  async function onDecline() {
    setBusy("decline");
    try {
      await declineInvite(invite.id);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        compact ? "gap-2" : "gap-3",
      )}
    >
      <div className="min-w-0">
        <p className={cn("font-medium", compact ? "text-sm" : "text-sm")}>
          {invite.name || invite.domain}
          <span className="ml-2 font-normal text-muted-foreground">
            {invite.domain}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          {roleLabel(t, invite.role)} · {t("invitedBy")}: {who}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void onAccept()}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
        >
          {t("accept")}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void onDecline()}
          className="rounded-lg border border-border px-3 py-1.5 text-xs disabled:opacity-50"
        >
          {t("decline")}
        </button>
      </div>
    </div>
  );
}

export function InviteWarningBanner() {
  const t = useTranslations("demo.access");
  const pathname = usePathname();
  const { invites } = useInviteInbox();
  if (invites.length === 0) return null;
  if (pathname.endsWith("/access")) return null;

  return (
    <div className="shrink-0 border-b border-accent/25 bg-accent-soft px-4 py-3 sm:px-6">
      <p className="text-sm font-medium text-accent">
        {t("pendingWarning", { count: invites.length })}
      </p>
      <div className="mt-2 space-y-3">
        {invites.map((invite) => (
          <IncomingInviteRow key={invite.id} invite={invite} compact />
        ))}
      </div>
    </div>
  );
}

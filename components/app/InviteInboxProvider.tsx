"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { useLiveRefetch } from "@/components/app/LiveAppSocket";

export type InboxInvite = {
  id: string;
  appId: string;
  domain: string;
  name: string;
  role: string;
  invitedByName: string | null;
  invitedByEmail: string | null;
  expiresAt: string;
};

type InboxContextValue = {
  invites: InboxInvite[];
  loading: boolean;
  refreshInbox: () => Promise<void>;
  acceptInvite: (id: string) => Promise<string | null>;
  declineInvite: (id: string) => Promise<void>;
};

const InboxContext = createContext<InboxContextValue | null>(null);

export function InviteInboxProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { refreshApps } = useActiveApp();
  const apiToken = session?.apiToken;
  const [invites, setInvites] = useState<InboxInvite[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshInbox = useCallback(async (opts?: { silent?: boolean }) => {
    if (status === "loading") {
      if (!opts?.silent) setLoading(true);
      return;
    }
    if (!apiToken) {
      setInvites([]);
      setLoading(false);
      return;
    }
    if (!opts?.silent) setLoading(true);
    try {
      const res = await apiFetch<{ invitations: InboxInvite[] }>(
        "/v1/invitations/inbox",
        { token: apiToken },
      );
      setInvites(res.invitations);
    } catch {
      setInvites([]);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, [apiToken, status]);

  useEffect(() => {
    void refreshInbox();
  }, [refreshInbox]);

  useLiveRefetch(() => void refreshInbox({ silent: true }), 400, "inbox");

  const acceptInvite = useCallback(
    async (id: string) => {
      if (!apiToken) return null;
      const res = await apiFetch<{ ok: boolean; appId: string }>(
        `/v1/invitations/${id}/accept`,
        { method: "POST", token: apiToken },
      );
      await Promise.all([refreshInbox(), refreshApps(res.appId)]);
      return res.appId;
    },
    [apiToken, refreshInbox, refreshApps],
  );

  const declineInvite = useCallback(
    async (id: string) => {
      if (!apiToken) return;
      await apiFetch(`/v1/invitations/${id}/decline`, {
        method: "POST",
        token: apiToken,
      });
      await refreshInbox();
    },
    [apiToken, refreshInbox],
  );

  const value = useMemo(
    () => ({
      invites,
      loading,
      refreshInbox,
      acceptInvite,
      declineInvite,
    }),
    [invites, loading, refreshInbox, acceptInvite, declineInvite],
  );

  return (
    <InboxContext.Provider value={value}>{children}</InboxContext.Provider>
  );
}

export function useInviteInbox() {
  const ctx = useContext(InboxContext);
  if (!ctx) {
    throw new Error("useInviteInbox must be used within InviteInboxProvider");
  }
  return ctx;
}

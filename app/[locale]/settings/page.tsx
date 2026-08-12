"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/app/AppHeader";

export default function SettingsPage() {
  const { data } = useSession();
  const t = useTranslations("demo");
  const [me, setMe] = useState<{
    user: { id: string; email?: string | null; name?: string | null };
    accounts: { provider: string; providerAccountId: string }[];
  } | null>(null);

  useEffect(() => {
    if (!data?.apiToken) return;
    apiFetch<typeof me extends null ? never : NonNullable<typeof me>>(
      "/v1/auth/me",
      { token: data.apiToken },
    )
      .then(setMe)
      .catch(console.error);
  }, [data?.apiToken]);

  return (
    <>
      <AppHeader title={t.has("nav.settings") ? t("nav.settings") : "Settings"} />
      <main className="mx-auto max-w-lg flex-1 space-y-6 p-4 sm:p-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {me?.user.name ?? data?.user?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {me?.user.email ?? data?.user?.email ?? "No email"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-semibold">Linked accounts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in with Google.
          </p>
          <ul className="mt-4 space-y-2">
            {(me?.accounts ?? []).map((a) => (
              <li
                key={`${a.provider}-${a.providerAccountId}`}
                className="rounded-lg bg-muted/50 px-3 py-2 text-sm capitalize"
              >
                {a.provider}
              </li>
            ))}
            {!me?.accounts?.length && (
              <li className="text-sm text-muted-foreground">
                No linked providers yet
              </li>
            )}
          </ul>
        </div>
      </main>
    </>
  );
}

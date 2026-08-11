"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import { Link } from "@/i18n/navigation";
import { LanguageSelect } from "@/components/LanguageSelect";
import { Activity } from "lucide-react";

export default function SettingsPage() {
  const { data } = useSession();
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
    <div className="min-h-dvh bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
        <Link href="/app" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </span>
          Settings
        </Link>
        <LanguageSelect />
      </header>
      <main className="mx-auto max-w-lg space-y-6 p-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h1 className="text-xl font-semibold">Profile</h1>
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
            Google and Telegram can be linked to the same tashrif account (via
            email match on Google, or /v1/auth/link).
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
              <li className="text-sm text-muted-foreground">No linked providers yet</li>
            )}
          </ul>
        </div>
        <Link href="/app" className="text-sm text-primary underline">
          ← Back to apps
        </Link>
      </main>
    </div>
  );
}

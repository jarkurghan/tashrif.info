"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useActiveApp } from "@/components/app/ActiveAppProvider";

/**
 * /app → active site traffic (or domains if none selected / empty).
 */
export default function AppIndexPage() {
  const router = useRouter();
  const { apps, activeAppId, loading } = useActiveApp();

  useEffect(() => {
    if (loading) return;

    if (activeAppId) {
      router.replace(`/app/${activeAppId}/traffic`);
      return;
    }

    if (apps.length === 1) {
      router.replace(`/app/${apps[0]!.id}/traffic`);
      return;
    }

    router.replace("/app/domains");
  }, [loading, activeAppId, apps, router]);

  return (
    <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
      …
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  useActiveApp,
  appSubPath,
} from "@/components/app/ActiveAppProvider";

const STORAGE_KEY = "tashrif_active_app_id";

export function ActiveAppGuard({ children }: { children: React.ReactNode }) {
  const params = useParams<{ appId: string }>();
  const urlAppId = params.appId;
  const pathname = usePathname();
  const router = useRouter();
  const { activeAppId, loading, adoptAppIdFromUrl } = useActiveApp();

  useEffect(() => {
    if (loading || !urlAppId) return;

    const stored =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

    if (!stored) {
      adoptAppIdFromUrl(urlAppId);
      return;
    }

    if (!activeAppId) {
      router.replace("/app");
      return;
    }

    if (urlAppId !== activeAppId) {
      router.replace(`/app/${activeAppId}${appSubPath(pathname)}`);
    }
  }, [
    loading,
    urlAppId,
    activeAppId,
    pathname,
    router,
    adoptAppIdFromUrl,
  ]);

  if (loading) return null;

  const stored =
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  if (!stored && urlAppId) return null;

  if (!activeAppId || urlAppId !== activeAppId) return null;

  return children;
}

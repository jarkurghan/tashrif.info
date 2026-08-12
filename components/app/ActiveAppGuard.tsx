"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  useActiveApp,
  appSubPath,
} from "@/components/app/ActiveAppProvider";

/**
 * URL is source of truth for /app/[appId]/...
 * Sync active site to the URL app when allowed.
 * Redirect only after apps finished loading and the URL app is inaccessible.
 */
export function ActiveAppGuard({ children }: { children: React.ReactNode }) {
  const params = useParams<{ appId: string }>();
  const urlAppId = params.appId;
  const pathname = usePathname();
  const router = useRouter();
  const { apps, activeAppId, loading, setActiveAppId } = useActiveApp();
  const redirected = useRef(false);

  const urlAllowed =
    Boolean(urlAppId) && apps.some((a) => a.id === urlAppId);

  useEffect(() => {
    redirected.current = false;
  }, [urlAppId]);

  useEffect(() => {
    if (loading || !urlAppId || redirected.current) return;

    if (urlAllowed) {
      if (urlAppId !== activeAppId) setActiveAppId(urlAppId);
      return;
    }

    // Apps loaded; this appId is not in the list → leave this route once.
    redirected.current = true;
    if (activeAppId) {
      router.replace(`/app/${activeAppId}${appSubPath(pathname)}`);
    } else {
      router.replace("/app/domains");
    }
  }, [
    loading,
    urlAppId,
    urlAllowed,
    activeAppId,
    pathname,
    router,
    setActiveAppId,
  ]);

  if (loading) return null;
  if (!urlAllowed) return null;

  return children;
}

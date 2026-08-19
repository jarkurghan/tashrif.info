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
 * Adopt the URL app when the URL itself changes (back/forward, direct load).
 * Do not revert a newer SiteSelect choice while router.replace is still in flight.
 */
export function ActiveAppGuard({ children }: { children: React.ReactNode }) {
  const params = useParams<{ appId: string }>();
  const urlAppId = params.appId;
  const pathname = usePathname();
  const router = useRouter();
  const { apps, activeAppId, loading, setActiveAppId } = useActiveApp();
  const redirected = useRef(false);
  const activeAppIdRef = useRef(activeAppId);
  activeAppIdRef.current = activeAppId;

  const urlAllowed =
    Boolean(urlAppId) && apps.some((a) => a.id === urlAppId);
  const urlRole = apps.find((a) => a.id === urlAppId)?.role;
  const sub = appSubPath(pathname);
  const viewerBlocked =
    urlRole === "viewer" && (sub === "/access" || sub === "/reports");

  useEffect(() => {
    redirected.current = false;
  }, [urlAppId]);

  useEffect(() => {
    if (loading || !urlAppId || redirected.current) return;

    if (urlAllowed) {
      setActiveAppId(urlAppId);
      if (viewerBlocked) {
        router.replace(`/app/${urlAppId}/home`);
      }
      return;
    }

    // Apps loaded; this appId is not in the list → leave this route once.
    redirected.current = true;
    const fallback = activeAppIdRef.current;
    if (fallback) {
      router.replace(`/app/${fallback}${appSubPath(pathname)}`);
    } else {
      router.replace("/app/domains");
    }
  }, [
    loading,
    urlAppId,
    urlAllowed,
    viewerBlocked,
    pathname,
    router,
    setActiveAppId,
  ]);

  if (loading) return null;
  if (!urlAllowed) return null;
  if (viewerBlocked) return null;

  return children;
}

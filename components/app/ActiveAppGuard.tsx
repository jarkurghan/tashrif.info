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
      // Only adopt URL → context when the URL itself changed. Do not depend on
      // activeAppId: SiteSelect updates context before router.replace completes,
      // and syncing back to the stale param would refetch the previous site.
      if (urlAppId !== activeAppIdRef.current) setActiveAppId(urlAppId);
      if (viewerBlocked) {
        router.replace(`/app/${urlAppId}/traffic`);
      }
      return;
    }

    // Apps loaded; this appId is not in the list → leave this route once.
    redirected.current = true;
    const currentId = activeAppIdRef.current;
    if (currentId) {
      router.replace(`/app/${currentId}${appSubPath(pathname)}`);
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

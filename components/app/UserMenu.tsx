"use client";

import { useEffect, useId, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FolderKanban, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/cn";

export function UserMenu() {
  const t = useTranslations("demo");
  const { data } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const name = data?.user?.name ?? "Account";
  const email = data?.user?.email;
  const settingsLabel = t("nav.settings");
  const logoutLabel = t("account.logout");

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        title={name}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-sm font-semibold text-primary ring-offset-background transition hover:ring-2 hover:ring-ring/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        {data?.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.user.image}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          (data?.user?.name?.[0] ?? "U").toUpperCase()
        )}
      </button>

      <div
        id={menuId}
        role="menu"
        className={cn(
          "absolute right-0 z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg",
          open ? "block" : "hidden",
        )}
      >
        <div className="border-b border-border px-3 py-2.5">
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
          {email && (
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          )}
        </div>

        <Link
          href="/app/domains"
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground transition hover:bg-muted"
        >
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          {t("nav.domains")}
        </Link>

        <Link
          href="/settings"
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground transition hover:bg-muted"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          {settingsLabel}
        </Link>

        <div className="my-1 border-t border-border" />

        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            void signOut({ callbackUrl: "/" });
          }}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground transition hover:bg-muted"
        >
          <LogOut className="h-4 w-4 text-muted-foreground" />
          {logoutLabel}
        </button>
      </div>
    </div>
  );
}

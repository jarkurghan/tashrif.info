"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FolderKanban, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";

export function DemoUserMenu() {
  const t = useTranslations("demo");
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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        title="Demo"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-sm font-semibold text-primary ring-offset-background transition hover:ring-2 hover:ring-ring/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        D
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
          <p className="truncate text-sm font-medium text-foreground">Demo</p>
          <p className="truncate text-xs text-muted-foreground">demo@tashrif.info</p>
        </div>
        <Link
          href="/demo/domains"
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground transition hover:bg-muted"
        >
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          {t("nav.domains")}
        </Link>
        <Link
          href="/"
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground transition hover:bg-muted"
        >
          <LogOut className="h-4 w-4 text-muted-foreground" />
          {t("account.logout")}
        </Link>
      </div>
    </div>
  );
}

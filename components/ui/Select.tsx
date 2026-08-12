"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  "aria-label"?: string;
  size?: "sm" | "md";
  align?: "start" | "end";
  tabIndex?: number;
};

type MenuPos = {
  top: number;
  bottom: number;
  left: number;
  width: number;
  maxHeight: number;
  openUp: boolean;
};

export function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  className,
  triggerClassName,
  "aria-label": ariaLabel,
  size = "md",
  align = "start",
  tabIndex,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const enabledOptions = options.filter((o) => !o.disabled);
  const enabledCount = enabledOptions.length;

  useEffect(() => setMounted(true), []);

  const updatePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 6;
    const viewportPad = 8;
    const estimated = Math.min(280, enabledCount * 40 + 12);
    const spaceBelow = window.innerHeight - rect.bottom - viewportPad;
    const spaceAbove = rect.top - viewportPad;
    const openUp = spaceBelow < estimated && spaceAbove > spaceBelow;
    const maxHeight = Math.max(
      120,
      Math.min(280, openUp ? spaceAbove - gap : spaceBelow - gap),
    );
    const width = Math.max(rect.width, size === "sm" ? 88 : 140);
    let left = align === "end" ? rect.right - width : rect.left;
    left = Math.min(
      Math.max(viewportPad, left),
      window.innerWidth - width - viewportPad,
    );
    const edge = openUp ? rect.top - gap : rect.bottom + gap;
    setPos({
      top: edge,
      bottom: window.innerHeight - edge,
      left,
      width,
      maxHeight,
      openUp,
    });
  }, [align, enabledCount, size]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePos();
    const onScroll = () => updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, updatePos]);

  useEffect(() => {
    if (!open) return;
    const idx = enabledOptions.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
    // Focus list for keyboard nav after open
    requestAnimationFrame(() => listRef.current?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-sync highlight when opening / value changes
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const item = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function pick(next: string) {
    onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onListKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(enabledOptions.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(enabledOptions.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = enabledOptions[activeIndex];
      if (opt) pick(opt.value);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  const menuStyle: CSSProperties | undefined = pos
    ? pos.openUp
      ? {
          position: "fixed",
          bottom: pos.bottom,
          left: pos.left,
          width: pos.width,
          maxHeight: pos.maxHeight,
          zIndex: 80,
        }
      : {
          position: "fixed",
          top: pos.top,
          left: pos.left,
          width: pos.width,
          maxHeight: pos.maxHeight,
          zIndex: 80,
        }
    : undefined;

  const menu =
    mounted &&
    open &&
    pos &&
    createPortal(
      <div
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={-1}
        aria-label={ariaLabel}
        aria-activedescendant={
          activeIndex >= 0
            ? `${listId}-opt-${enabledOptions[activeIndex]?.value}`
            : undefined
        }
        onKeyDown={onListKeyDown}
        style={menuStyle}
        className="overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg shadow-black/10 outline-none ring-1 ring-black/5"
      >
        {options.map((opt) => {
          const enabledIdx = enabledOptions.findIndex(
            (o) => o.value === opt.value,
          );
          const isSelected = opt.value === value;
          const isActive = enabledIdx === activeIndex && !opt.disabled;

          return (
            <button
              key={opt.value}
              type="button"
              role="option"
              id={`${listId}-opt-${opt.value}`}
              data-index={enabledIdx}
              aria-selected={isSelected}
              disabled={opt.disabled}
              onMouseEnter={() => {
                if (!opt.disabled && enabledIdx >= 0) setActiveIndex(enabledIdx);
              }}
              onClick={() => {
                if (!opt.disabled) pick(opt.value);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                opt.disabled && "cursor-not-allowed opacity-40",
                !opt.disabled && isActive && "bg-muted text-foreground",
                !opt.disabled && !isActive && "text-foreground hover:bg-muted/70",
                isSelected && "font-medium text-primary",
              )}
            >
              <span className="min-w-0 flex-1 truncate">{opt.label}</span>
              <Check
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-primary transition-opacity",
                  isSelected ? "opacity-100" : "opacity-0",
                )}
                aria-hidden
              />
            </button>
          );
        })}
      </div>,
      document.body,
    );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => {
          if (!disabled) setOpen((v) => !v);
        }}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border border-border bg-background text-left text-foreground outline-none transition",
          "hover:border-primary/35 hover:bg-card",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "border-primary/45 ring-2 ring-ring/30",
          size === "sm" ? "px-2.5 py-1.5 text-sm" : "px-3 py-2 text-sm",
          triggerClassName,
        )}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            !selected && "text-muted-foreground",
          )}
        >
          {selected?.label ?? placeholder ?? "—"}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {menu}
    </div>
  );
}

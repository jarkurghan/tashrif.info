"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/demo-data";
import { MAP_VIEWBOX, countryPoint } from "@/lib/country-centroids";

export type MapCountry = {
  code?: string;
  label: string;
  value: number;
};

type Bubble = {
  code: string;
  label: string;
  value: number;
  x: number;
  y: number;
  r: number;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function injectBubbles(svgText: string, bubbles: Bubble[]): string {
  const marks = bubbles
    .map(
      (b) =>
        `<g class="map-bubble" data-code="${escapeXml(b.code)}" data-label="${escapeXml(b.label)}" data-value="${b.value}">` +
        `<circle cx="${b.x}" cy="${b.y}" r="${b.r}"/>` +
        `<circle cx="${b.x}" cy="${b.y}" r="${Math.max(4, b.r * 0.22)}"/>` +
        `</g>`,
    )
    .join("");
  return svgText.replace(/<\/svg>\s*$/i, `${marks}</svg>`);
}

export function TrafficMap({
  className,
  items = [],
}: {
  className?: string;
  items?: MapCountry[];
}) {
  const [svg, setSvg] = useState<string | null>(null);
  const [hover, setHover] = useState<{
    code: string;
    label: string;
    value: number;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/map.svg")
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((text) => {
        if (alive) setSvg(text);
      })
      .catch(() => {
        if (alive) setSvg("");
      });
    return () => {
      alive = false;
    };
  }, []);

  const bubbles = useMemo(() => {
    const max = Math.max(1, ...items.map((i) => i.value));
    return items
      .map((item) => {
        const code = item.code?.toUpperCase();
        if (!code || item.value <= 0) return null;
        const pt = countryPoint(code);
        if (!pt) return null;
        const t = Math.sqrt(item.value / max);
        return {
          code,
          label: item.label,
          value: item.value,
          x: pt.x,
          y: pt.y,
          r: 10 + t * 36,
        };
      })
      .filter((b): b is Bubble => b != null);
  }, [items]);

  const marked = useMemo(() => {
    if (!svg) return svg;
    return injectBubbles(svg, bubbles);
  }, [svg, bubbles]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-3 shadow-sm sm:p-5",
        className,
      )}
    >
      {marked ? (
        <div
          className="relative w-full [&_.map-bubble]:cursor-default"
          style={{ aspectRatio: `${MAP_VIEWBOX.w} / ${MAP_VIEWBOX.h}` }}
          onMouseOver={(e) => {
            const g = (e.target as Element).closest("[data-code]");
            if (!g) return;
            const code = g.getAttribute("data-code");
            const label = g.getAttribute("data-label");
            const value = Number(g.getAttribute("data-value"));
            if (code && label) setHover({ code, label, value });
          }}
          onMouseOut={(e) => {
            const related = e.relatedTarget as Node | null;
            const g = (e.target as Element).closest("[data-code]");
            if (g && related && g.contains(related)) return;
            setHover(null);
          }}
        >
          <div
            className="absolute inset-0 [&_svg]:absolute [&_svg]:inset-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_path]:fill-[var(--map-land)] [&_path]:stroke-[var(--map-active)] [&_path]:[stroke-width:0.5]"
            dangerouslySetInnerHTML={{ __html: marked }}
          />
        </div>
      ) : svg === "" ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Map unavailable
        </p>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">…</p>
      )}
      {hover && (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg border border-border bg-card/95 px-3 py-2 text-sm shadow-sm">
          <p className="font-medium">{hover.label}</p>
          <p className="tabular-nums text-muted-foreground">
            {formatCount(hover.value)}
          </p>
        </div>
      )}
    </div>
  );
}

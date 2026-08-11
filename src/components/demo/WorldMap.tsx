"use client";

import { countries } from "@/lib/demo-data";
import { cn } from "@/lib/cn";

/** Stylized world map with intensity markers for demo traffic hotspots */
const hotspots: { code: string; cx: number; cy: number; r: number }[] = [
  { code: "US", cx: 170, cy: 130, r: 28 },
  { code: "UZ", cx: 430, cy: 125, r: 18 },
  { code: "DE", cx: 355, cy: 105, r: 14 },
  { code: "GB", cx: 335, cy: 95, r: 12 },
  { code: "RU", cx: 480, cy: 80, r: 16 },
  { code: "TR", cx: 395, cy: 130, r: 12 },
  { code: "FR", cx: 340, cy: 115, r: 11 },
  { code: "KZ", cx: 455, cy: 110, r: 11 },
];

export function WorldMap({ className }: { className?: string }) {
  const max = Math.max(...countries.map((c) => c.value));
  const byCode = Object.fromEntries(countries.map((c) => [c.code, c]));

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm",
        className,
      )}
    >
      <svg viewBox="0 0 640 320" className="h-full w-full" role="img" aria-label="World map">
        <defs>
          <radialGradient id="ocean" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="var(--primary-soft)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--muted)" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        <rect width="640" height="320" fill="url(#ocean)" rx="12" />

        {/* Simplified continents */}
        <path
          fill="var(--map-land)"
          d="M90 90c40-35 110-40 150-10 25 18 35 40 20 70-18 36-70 55-115 45-48-10-80-55-55-105z"
          opacity="0.9"
        />
        <path
          fill="var(--map-land)"
          d="M175 175c18 5 32 35 18 70-10 25-40 40-65 28-28-14-30-55-8-78 12-13 35-24 55-20z"
          opacity="0.85"
        />
        <path
          fill="var(--map-land)"
          d="M310 70c55-20 100-8 120 30 15 28 5 55-20 70-35 20-85 15-110-15-22-26-18-65 10-85z"
          opacity="0.9"
        />
        <path
          fill="var(--map-land)"
          d="M400 95c70-15 130 5 155 45 20 32 10 70-25 85-40 18-100 10-130-20-35-35-30-85 0-110z"
          opacity="0.88"
        />
        <path
          fill="var(--map-land)"
          d="M470 185c35 5 55 40 40 75-12 28-50 35-75 18-28-18-30-55-5-78 12-11 25-17 40-15z"
          opacity="0.8"
        />
        <path
          fill="var(--map-land)"
          d="M520 210c40 0 70 25 65 55-4 28-40 40-70 28-28-12-35-45-10-65 8-7 10-18 15-18z"
          opacity="0.75"
        />

        {hotspots.map((h) => {
          const item = byCode[h.code];
          if (!item) return null;
          const intensity = 0.35 + (item.value / max) * 0.65;
          return (
            <g key={h.code}>
              <circle
                cx={h.cx}
                cy={h.cy}
                r={h.r * 1.6}
                fill="var(--map-active)"
                opacity={intensity * 0.2}
              />
              <circle
                cx={h.cx}
                cy={h.cy}
                r={h.r * 0.55}
                fill="var(--map-active)"
                opacity={intensity}
              />
              <title>
                {item.label}: {item.value}
              </title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

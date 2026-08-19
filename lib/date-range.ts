export const RANGE_KEYS = ["24h", "7d", "30d", "90d"] as const;
export type RangeKey = (typeof RANGE_KEYS)[number];

export const DEFAULT_RANGE: RangeKey = "24h";
export const RANGE_STORAGE_KEY = "tashrif_date_range";

export function isRangeKey(v: string | null | undefined): v is RangeKey {
  return RANGE_KEYS.includes(v as RangeKey);
}

export function rangeBounds(key: RangeKey, now = new Date()): { from: Date; to: Date } {
  const to = new Date(now);
  const from = new Date(to);
  if (key === "24h") {
    from.setTime(to.getTime() - 24 * 60 * 60 * 1000);
  } else if (key === "7d") {
    from.setTime(to.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (key === "30d") {
    from.setUTCMonth(from.getUTCMonth() - 1);
  } else {
    from.setUTCMonth(from.getUTCMonth() - 3);
  }
  return { from, to };
}

export function rangeSearchParams(key: RangeKey, now = new Date()): URLSearchParams {
  const { from, to } = rangeBounds(key, now);
  return new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
  });
}

export function isAnalyticsPath(pathname: string) {
  return (
    /(^|\/)(home|traffic|pages|logs)$/.test(pathname) ||
    /(^|\/)demo$/.test(pathname)
  );
}

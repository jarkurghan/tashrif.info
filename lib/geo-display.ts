export function flagEmoji(code: string | undefined): string | undefined {
  if (!code || code.length !== 2 || !/^[A-Za-z]{2}$/.test(code)) return undefined;
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...[...upper].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65),
  );
}

function isCyrillic(value: string): boolean {
  return /[\u0400-\u04FF]/.test(value);
}

function regionName(code: string, locale: string): string | undefined {
  try {
    const name = new Intl.DisplayNames([locale], { type: "region" }).of(code);
    if (!name || isCyrillic(name)) return undefined;
    return name;
  } catch {
    return undefined;
  }
}

export function countryLabel(code: string, locale: string): string {
  if (!code || code === "Unknown" || code === "??") return code || "Unknown";
  if (code.length !== 2) return code;
  const upper = code.toUpperCase();
  // Bare `uz` falls back to Russian on Windows/ICU. Prefer Latin Uzbek, then English.
  const locales = locale.startsWith("uz") ? ["uz-Latn", "en"] : ["en"];
  for (const loc of locales) {
    const name = regionName(upper, loc);
    if (name) return name;
  }
  return upper;
}

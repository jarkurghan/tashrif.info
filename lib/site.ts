export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://tashrif.info"
).replace(/\/$/, "");

export const SITE_NAME = "tashrif.info";

export function localePath(locale: string, path = "") {
  const suffix = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${suffix}`;
}

export function absoluteUrl(locale: string, path = "") {
  return `${SITE_URL}${localePath(locale, path)}`;
}

export function languageAlternates(path = "") {
  return {
    uz: absoluteUrl("uz", path),
    en: absoluteUrl("en", path),
    "x-default": absoluteUrl("uz", path),
  };
}

export const LOCALE_PREFERENCE_COOKIE = "tashrif_locale";

export type AppLocale = "uz" | "en";

export function isAppLocale(v: string | null | undefined): v is AppLocale {
  return v === "uz" || v === "en";
}

const MAX_AGE = 60 * 60 * 24 * 365;

export function setLocalePreference(locale: AppLocale) {
  document.cookie = `${LOCALE_PREFERENCE_COOKIE}=${locale};path=/;max-age=${MAX_AGE};SameSite=Lax`;
}

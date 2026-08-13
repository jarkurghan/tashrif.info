import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "uz"],
  defaultLocale: "uz",
  localePrefix: "always",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

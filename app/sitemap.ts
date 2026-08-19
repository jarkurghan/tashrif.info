import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL, localePath } from "@/lib/site";

const publicPaths = [
  "",
  "/login",
  "/demo",
  "/demo/home",
  "/demo/traffic",
  "/demo/pages",
  "/demo/logs",
  "/demo/reports",
  "/demo/access",
  "/demo/domains",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routing.locales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified: now,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "/demo" || path === "/demo/home" ? 0.8 : 0.6,
    })),
  );
}

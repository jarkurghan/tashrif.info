import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  languageAlternates,
} from "@/lib/site";

export function publicPageMetadata(input: {
  locale: string;
  path: string;
  title: string | { absolute: string };
  description: string;
  keywords?: string;
}): Metadata {
  const { locale, path, title, description, keywords } = input;
  const url = absoluteUrl(locale, path);
  const ogLocale = locale === "en" ? "en_US" : "uz_UZ";
  const titlePlain = typeof title === "string" ? title : title.absolute;

  return {
    title,
    description,
    keywords: keywords || undefined,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "technology",
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: locale === "en" ? ["uz_UZ"] : ["en_US"],
      url,
      siteName: SITE_NAME,
      title: titlePlain,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: titlePlain,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const noIndexMetadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export async function demoMetadata(locale: string, section?: string) {
  const t = await getTranslations({ locale, namespace: "meta" });
  const sectionTitle = section
    ? (await getTranslations({ locale, namespace: "demo.nav" }))(section)
    : null;
  return publicPageMetadata({
    locale,
    path: section ? `/demo/${section}` : "/demo",
    title: sectionTitle ? `${sectionTitle} · ${t("demoTitle")}` : t("demoTitle"),
    description: t("demoDescription"),
  });
}

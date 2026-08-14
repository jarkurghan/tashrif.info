import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { publicPageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return publicPageMetadata({
    locale,
    path: "/login",
    title: t("loginTitle"),
    description: t("loginDescription"),
  });
}

export default async function LoginLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const pageUrl = absoluteUrl(locale, "/login");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("loginTitle"),
          description: t("loginDescription"),
          url: pageUrl,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
          inLanguage: locale,
        }}
      />
      {children}
    </>
  );
}

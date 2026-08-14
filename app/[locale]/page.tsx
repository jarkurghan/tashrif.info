import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Hero } from "@/components/marketing/Hero";
import { ProductIntro } from "@/components/marketing/ProductIntro";
import { FeatureSteps } from "@/components/marketing/FeatureSteps";
import { MetricsPreview } from "@/components/marketing/MetricsPreview";
import { WhyTashrif } from "@/components/marketing/WhyTashrif";
import { ClosingCta } from "@/components/marketing/ClosingCta";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return publicPageMetadata({
    locale,
    path: "",
    title: { absolute: t("title") },
    description: t("description"),
    keywords: t("keywords"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  const pageUrl = absoluteUrl(locale, "");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#org`,
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/favicon.ico`,
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: SITE_NAME,
              url: SITE_URL,
              inLanguage: ["uz", "en"],
              publisher: { "@id": `${SITE_URL}/#org` },
            },
            {
              "@type": "SoftwareApplication",
              name: SITE_NAME,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: pageUrl,
              description: t("description"),
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              publisher: { "@id": `${SITE_URL}/#org` },
            },
            {
              "@type": "WebPage",
              "@id": `${pageUrl}#page`,
              url: pageUrl,
              name: t("title"),
              description: t("description"),
              isPartOf: { "@id": `${SITE_URL}/#website` },
              inLanguage: locale,
            },
          ],
        }}
      />
      <MarketingNav />
      <main className="flex-1">
        <Hero />
        <ProductIntro />
        <FeatureSteps />
        <MetricsPreview />
        <WhyTashrif />
        <ClosingCta />
      </main>
      <MarketingFooter />
    </>
  );
}

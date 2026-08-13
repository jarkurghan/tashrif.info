import { setRequestLocale } from "next-intl/server";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Hero } from "@/components/marketing/Hero";
import { ProductIntro } from "@/components/marketing/ProductIntro";
import { FeatureSteps } from "@/components/marketing/FeatureSteps";
import { MetricsPreview } from "@/components/marketing/MetricsPreview";
import { WhyTashrif } from "@/components/marketing/WhyTashrif";
import { ClosingCta } from "@/components/marketing/ClosingCta";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
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

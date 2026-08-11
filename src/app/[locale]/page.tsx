import { setRequestLocale } from "next-intl/server";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Hero } from "@/components/marketing/Hero";
import { FeatureSteps } from "@/components/marketing/FeatureSteps";
import { MetricsPreview } from "@/components/marketing/MetricsPreview";
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
        <FeatureSteps />
        <MetricsPreview />
      </main>
      <MarketingFooter />
    </>
  );
}

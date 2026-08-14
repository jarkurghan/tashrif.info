import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoShellProvider } from "@/components/demo/DemoShellContext";
import { DemoSidebar } from "@/components/demo/DemoSidebar";
import { DemoHeader } from "@/components/demo/DemoHeader";
import { DateRangeProvider } from "@/components/app/DateRangeProvider";
import { JsonLd } from "@/components/JsonLd";
import { demoMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return demoMetadata(locale);
}

export default async function DemoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  const pageUrl = absoluteUrl(locale, "/demo");

  return (
    <DemoShellProvider>
      <DateRangeProvider>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("demoTitle"),
          description: t("demoDescription"),
          url: pageUrl,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
          inLanguage: locale,
        }}
      />
      <div className="flex h-dvh overflow-hidden bg-background">
        <DemoSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <DemoHeader />
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
      </DateRangeProvider>
    </DemoShellProvider>
  );
}

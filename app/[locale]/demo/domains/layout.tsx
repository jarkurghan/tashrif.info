import { demoMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return demoMetadata(locale, "domains");
}

export default function DemoDomainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

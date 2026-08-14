import { getTranslations } from "next-intl/server";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "tashrif.info login";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return ogImage({
    title: t("loginTitle"),
    subtitle: t("loginDescription"),
  });
}

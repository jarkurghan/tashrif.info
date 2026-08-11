import { AuthProvider } from "@/components/AuthProvider";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  console.log("[social-env]", {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? null,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
      ? `${process.env.GOOGLE_CLIENT_SECRET.slice(0, 8)}…`
      : null,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
      ? `${process.env.TELEGRAM_BOT_TOKEN.slice(0, 10)}…`
      : null,
    TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME ?? null,
    NEXT_PUBLIC_TELEGRAM_BOT_NAME:
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME ?? null,
  });

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

/**
 * Central env access.
 * - Server secrets: set at container runtime
 * - NEXT_PUBLIC_*: set as Docker build-args (inlined at build)
 */
export const env = {
  nextAuthUrl: process.env.NEXTAUTH_URL ?? "",
  nextAuthSecret:
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "",
  apiUrl:
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.tashrif.info",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "wss://api.tashrif.info/ws",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  telegramBotName:
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME ||
    process.env.TELEGRAM_BOT_NAME ||
    "",
};

export function socialEnvSnapshot() {
  return {
    GOOGLE_CLIENT_ID: env.googleClientId || null,
    GOOGLE_CLIENT_SECRET: env.googleClientSecret
      ? `${env.googleClientSecret.slice(0, 8)}…`
      : null,
    TELEGRAM_BOT_TOKEN: env.telegramBotToken
      ? `${env.telegramBotToken.slice(0, 10)}…`
      : null,
    TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME ?? null,
    NEXT_PUBLIC_TELEGRAM_BOT_NAME:
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME ?? null,
    NEXTAUTH_URL: env.nextAuthUrl || null,
    API_URL: env.apiUrl,
    NEXT_PUBLIC_WS_URL: env.wsUrl,
  };
}

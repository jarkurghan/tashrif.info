import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Runtime env check (secrets masked). Used by browser console debug. */
export async function GET() {
  return NextResponse.json({
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
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? null,
    API_URL: process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? null,
  });
}

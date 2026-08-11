"use client";

import { useEffect } from "react";

export type SocialEnvSnapshot = {
  GOOGLE_CLIENT_ID: string | null;
  GOOGLE_CLIENT_SECRET: string | null;
  TELEGRAM_BOT_TOKEN: string | null;
  TELEGRAM_BOT_NAME: string | null;
  NEXT_PUBLIC_TELEGRAM_BOT_NAME: string | null;
};

export function SocialEnvLog({ env }: { env: SocialEnvSnapshot }) {
  useEffect(() => {
    console.log("[social-env]", env);
  }, [env]);

  return null;
}

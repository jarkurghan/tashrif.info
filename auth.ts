import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { Provider } from "next-auth/providers";

function apiUrl() {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.tashrif.info"
  ).replace(/\/$/, "");
}

function authSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || undefined;
}

async function syncToApi(input: {
  provider: "google" | "telegram";
  providerAccountId: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}) {
  const res = await fetch(`${apiUrl()}/v1/auth/sync`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API sync failed (${res.status}): ${text}`);
  }
  return (await res.json()) as {
    token: string;
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  };
}

function buildProviders(): Provider[] {
  const providers: Provider[] = [];
  const googleId = process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (googleId && googleSecret) {
    providers.push(
      Google({
        clientId: googleId,
        clientSecret: googleSecret,
        allowDangerousEmailAccountLinking: true,
      }),
    );
  }

  providers.push(
    Credentials({
      id: "telegram",
      name: "Telegram",
      credentials: {
        id: {},
        first_name: {},
        last_name: {},
        username: {},
        photo_url: {},
        auth_date: {},
        hash: {},
      },
      async authorize(credentials) {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken || !credentials) return null;
        const data: Record<string, string> = {};
        for (const [k, v] of Object.entries(credentials)) {
          if (v != null && v !== "") data[k] = String(v);
        }
        const { hash, ...rest } = data;
        if (!hash) return null;
        const checkString = Object.keys(rest)
          .sort()
          .map((k) => `${k}=${rest[k]}`)
          .join("\n");
        const key = createHash("sha256").update(botToken).digest();
        const hmac = createHmac("sha256", key).update(checkString).digest("hex");
        try {
          if (!timingSafeEqual(Buffer.from(hmac), Buffer.from(hash))) return null;
        } catch {
          return null;
        }
        const authDate = Number(data.auth_date);
        if (!authDate || Date.now() / 1000 - authDate > 86400) return null;

        return {
          id: data.id,
          name:
            [data.first_name, data.last_name].filter(Boolean).join(" ") ||
            data.username,
          image: data.photo_url,
          email: null,
        };
      },
    }),
  );

  return providers;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: buildProviders(),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        try {
          const provider = account.provider === "google" ? "google" : "telegram";
          const synced = await syncToApi({
            provider,
            providerAccountId: account.providerAccountId || String(user.id),
            email: user.email,
            name: user.name,
            image: user.image,
          });
          token.apiToken = synced.token;
          token.userId = synced.user.id;
          token.email = synced.user.email;
          token.name = synced.user.name;
          token.picture = synced.user.image;
          token.error = undefined;
        } catch (e) {
          console.error("syncToApi failed", e);
          token.error = "SyncError";
          delete token.apiToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.apiToken = token.apiToken as string | undefined;
      session.error = token.error as string | undefined;
      if (session.user) {
        session.user.id = (token.userId as string) || session.user.id;
      }
      return session;
    },
  },
  secret: authSecret(),
  trustHost: true,
});

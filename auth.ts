import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
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
  provider: "google";
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
          const synced = await syncToApi({
            provider: "google",
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

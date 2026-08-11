# tashrif.info UI

Next.js App Router + Tailwind + next-intl + NextAuth (Google / Telegram) + Recharts.

## Setup

```bash
cp .env.example .env.local
# fill GOOGLE_* and TELEGRAM_* for real login
bun install
bun dev
```

Requires API at `NEXT_PUBLIC_API_URL` (default `https://localapi.sanoq.uz`).
Local UI domain: `https://boshqa.sanoq.uz` → `:3000`.

## Routes

- `/[locale]` — landing
- `/[locale]/demo/*` — hard-coded demo
- `/[locale]/login` — Google + Telegram
- `/[locale]/app` — domains (auth)
- `/[locale]/app/[appId]/*` — live analytics
- `/[locale]/settings` — profile / linked accounts

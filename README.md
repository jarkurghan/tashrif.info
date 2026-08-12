# tashrif.info UI

Structure (no `src/`):

```
app/           # Next.js App Router
components/    # UI (marketing, demo, app)
i18n/
lib/
messages/
middleware.ts
auth.ts
public/
```

## Dev

```bash
cp .env.example .env.local
# fill secrets
npm install   # or bun install
npm run dev   # or bun dev
```

## Env

| Kind | When | Examples |
|------|------|----------|
| `NEXT_PUBLIC_*` | **Docker build-args** | `NEXT_PUBLIC_API_URL` |
| Secrets | **Container runtime** | `GOOGLE_*`, `NEXTAUTH_SECRET`, `API_URL` |

`.env.local` is for local only — not copied into Docker images.

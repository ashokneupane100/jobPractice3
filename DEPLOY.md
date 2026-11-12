# Deploying Prept to a test server

The app is a standard Next.js 16 (App Router) project. Only requirement: **Node 20+** and a
public **HTTPS** URL (browsers block camera/mic on plain HTTP, except `localhost`).

## 1. Environment

Create `.env` in the project root from `.env.example` and fill every value.
`.env` must exist **before** `npm install`: the `postinstall` script runs
`prisma generate`, and `prisma.config.ts` reads `DIRECT_URL`.

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Test keys (`pk_test_…`/`sk_test_…`) are fine for a test server. Use `pk_live_…`/`sk_live_…` + a verified domain for real production. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` … | Leave as in `.env.example`. |
| `DATABASE_URL` | Supabase **transaction pooler** (port 6543). Keep `?pgbouncer=true&connect_timeout=30`. |
| `DIRECT_URL` | Supabase **session/direct** (port 5432). Keep `?connect_timeout=30&pool_timeout=30`. |
| `NEXT_PUBLIC_STREAM_API_KEY` / `STREAM_API_SECRET` | Stream dashboard → App → API keys. |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey |
| `GEMINI_MODEL` | Optional. Default `gemini-3.5-flash`. Retired names (`gemini-2.5-*`, `gemini-2.0-*`) return 404 for new keys. |
| `RESEND_API_KEY` | https://resend.com/api-keys — needed for withdrawal emails only. |
| `ADMIN_EMAIL` | Inbox that receives withdrawal requests. With Resend's test sender, this must be the Resend account owner's email. |
| `ADMIN_PAYOUT_PASSWORD` | Password typed on `/payout/[id]` to approve a withdrawal. |
| `NEXT_PUBLIC_APP_URL` | Full public URL of the deployment (used in email links), no trailing slash. |
| `ARCJET_KEY` | Arcjet bot/shield rules run in `proxy.js`. |

## 2. Install, migrate, build, run

```bash
npm ci
npx prisma migrate deploy
npm run build
npm run start          # listens on :3000, set PORT to change
```

Put a reverse proxy (Caddy/Nginx) in front and serve over HTTPS.
If you deploy to Vercel/Render/Fly, set the same variables in the dashboard and
`npx prisma migrate deploy` once from your machine (or a release step).

## 3. Stream webhooks

In the Stream dashboard → Chat/Video app → Webhooks, add:

```
https://YOUR_DOMAIN/api/webhooks/stream
```

Enable `call.recording_ready` and `call.transcription_ready`.
Stream signs each request with your API secret in the `x-signature` header;
`app/api/webhooks/stream/route.js` verifies it and rejects unsigned calls with
`401`. For local debugging without real Stream traffic you can set
`STREAM_WEBHOOK_VERIFY=false`.

## 4. Post-deploy checks

```bash
curl -o /dev/null -w '%{http_code}\n' https://YOUR_DOMAIN/            # 200
curl -o /dev/null -w '%{http_code}\n' https://YOUR_DOMAIN/sign-in     # 200
curl -o /dev/null -w '%{http_code}\n' https://YOUR_DOMAIN/dashboard   # 307 -> sign-in when signed out
curl -i -X POST https://YOUR_DOMAIN/api/webhooks/stream \
  -H 'content-type: application/json' -d '{"type":"test"}'            # 401 (unsigned)
```

Then sign in, book a slot, and open the call link in two browsers. AI Questions
only appears for the interviewer, inside the call's right-hand panel.

## Notes

- `npm run lint` passes with 0 errors (only generated-Prisma warnings).
- `prisma/migrations/` is already applied to the current Supabase database; run
  `prisma migrate deploy` on a fresh database.
- If video joins fail with "Could not join the call", the call is re-provisioned
  automatically from the call page; ask the user to press **Try again**.
- AI question generation takes ~10s (Gemini writes 6 Q&A pairs). On serverless
  platforms, set the function timeout to at least 30s.

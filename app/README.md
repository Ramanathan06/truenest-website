# TrueNest — Full-Stack App (lead-capture slice)

Next.js (App Router, TypeScript) + Supabase Postgres. This first slice
captures leads to a real database and lets you view them. CMS / admin
panel / page port come in later iterations (see `../ARCHITECTURE_AND_PLAN.md`).

This `app/` lives alongside the existing static marketing site, which keeps
serving on GitHub Pages until this app is deployed.

## What's here

| Path | Purpose |
|---|---|
| `app/inquire` | Public inquiry form → posts to the API |
| `app/api/leads` | `POST` endpoint: validates + stores a lead in Postgres |
| `app/leads` | Token-gated page listing captured leads |
| `lib/supabase.ts` | Server-only Supabase client (service role) |
| `supabase/schema.sql` | `leads` table + RLS lockdown |

## Setup — the steps only you can do

These need your Supabase/Vercel accounts; I can't provision them.

### 1. Create the Supabase project
1. Go to https://supabase.com → New project (pick a region near Bangalore, e.g. `ap-south-1` Mumbai).
2. Wait for it to finish provisioning.

### 2. Create the table
- Supabase Dashboard → **SQL Editor** → New query → paste the contents of
  `supabase/schema.sql` → **Run**.

### 3. Wire env vars
```bash
cd app
cp .env.local.example .env.local
```
Fill `.env.local` from Supabase → **Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role secret (server only)
- `LEADS_ADMIN_TOKEN` = a long random string you pick (`openssl rand -hex 24`)

### 4. Run locally
```bash
npm install
npm run dev
```
- Form: http://localhost:3000/inquire
- Leads: http://localhost:3000/leads?key=YOUR_LEADS_ADMIN_TOKEN

### 5. Deploy (Vercel)
1. https://vercel.com → New Project → import this repo.
2. **Set Root Directory to `app`** (dashboard only — this *cannot* be set in
   `vercel.json`; it's the one manual step). Vercel auto-detects Next.js.
3. Add the same four env vars in Vercel → Project → Settings → Environment Variables.
4. Deploy. Your leads page: `https://<deployment>/leads?key=YOUR_LEADS_ADMIN_TOKEN`.

`app/vercel.json` already pins the rest: Next.js framework, Mumbai region
(`bom1`, close to a Mumbai Supabase project), and the `/api/leads` function
timeout — so you only do the Root Directory + env vars by hand.

## Security notes
- `leads` has **RLS enabled with no policies** → the browser/anon key can't
  read or write it. All access is server-side via the service_role key.
- Never commit `.env.local`. The service role key and admin token are secrets.
- The `/leads` gate is a shared token (good enough for this slice). A proper
  auth-backed admin comes with the Payload CMS iteration.

## Connecting the existing static site (already wired)
The static site's three forms (home CTA, `inquiries.html`, `careers.html`)
already POST to this app's `/api/leads` via `assets/js/leads.js`.

To activate after deploy:
1. Open `assets/js/leads-config.js` (repo root, **not** in `app/`).
2. Set the endpoint to your deployment, e.g.:
   `window.TRUENEST_LEADS_ENDPOINT = "https://truenest-xyz.vercel.app/api/leads";`
3. Commit/push — GitHub Pages redeploys; forms now store leads.

Until that line is filled, the forms still work but only show the
thank-you message (no data stored) — the live site never breaks.
CORS already allows `https://ramanathan06.github.io` and localhost; add a
custom domain via `LEADS_ALLOWED_ORIGINS`.

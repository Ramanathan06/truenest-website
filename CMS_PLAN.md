# TrueNest — Scoped CMS & Admin Plan

Status: **proposal — no code yet.** Drafted 2026-05-21, after the
lead-capture slice went live (Supabase project `thisgccsvwiykjwiuzqx` +
Vercel deployment `truenest-website-8lbx.vercel.app`).

The full client requirement asks for "CMS-ready development" and an
"admin panel if needed." Rather than re-platform all 8 hand-coded
marketing pages into a heavy CMS (weeks of work for content that
barely changes), this plan builds a **focused admin over the content
that genuinely moves**: Projects, Testimonials, and Leads.

---

## 1. Goal

A non-technical TrueNest team member can log in and:

- Add or edit a project (name, location, status, photos, brochure PDF, key stats, copy).
- Toggle which project is the **"ongoing/featured"** one shown on the homepage hero banner.
- Add, edit, or hide testimonials.
- View, filter, mark status on (`new` / `contacted` / `closed`), and export leads.
- All without touching HTML, CSS, or asking a developer.

## 2. Scope

**In scope (managed via the admin / read by the site):**

| Entity | Why it's CMS-managed |
|---|---|
| Projects | New launches, photo swaps, brochure updates, status changes — the most-edited entity in the site's life |
| Testimonials | Added regularly; non-technical edits |
| Leads | Already in DB; needs proper auth + status workflow |
| Site settings | One row: which project is "ongoing/featured", contact details, social handles |

**Out of scope (stays hand-coded for now — CMS-ready means we *can* add later):**

- The story page, careers copy, hero narrative copy, footer base text.
- The look-and-feel itself (no theme editor).
- Page routing / new arbitrary pages.

Rationale: these change once a year at most. CMS-ifying them triples the build cost for marginal value. The data model and admin shell are designed so they can be folded in later without rework.

## 3. Tech choices

| Decision | Choice | Why |
|---|---|---|
| Backend | Reuse the existing **Next.js App Router app in `app/`** + **Supabase Postgres** | Already live, already wired, already paid for |
| Auth | **Supabase Auth** (email + password, magic link optional) | Built in, free, integrates with RLS, no third party |
| Admin UI | Custom Next.js pages under `app/admin/*` | Lighter than dropping in a full CMS framework; matches the existing minimalist stack |
| File storage | **Supabase Storage** buckets (`project-photos`, `brochures`) | Same provider, signed URLs, no extra service |
| Static-site reads | Two thin JSON endpoints on the Next app, consumed by the GitHub Pages HTML pages | Keeps current static site working; no big-bang migration |

**Deliberately NOT chosen:** Payload CMS / Strapi / Sanity. Each would mean a second service, more env complexity, and forcing all marketing pages into a CMS schema before the project is ready for that.

## 4. Data model

New tables alongside the existing `leads`:

```sql
-- projects
id              uuid pk
slug            text unique          -- e.g. 'retreat-76'
name            text                 -- 'Retreat 76'
tagline         text
location        text                 -- 'Nandi Hills, Bangalore · 915m'
status          text                 -- 'ongoing' | 'upcoming' | 'completed'
configuration   text                 -- '1 BHK', etc.
altitude_m      int
land_sqft       int
residences      int
hero_image_url  text                 -- Storage URL
brochure_url    text                 -- Storage URL (private; signed when gated)
body_md         text                 -- markdown long copy
sort_order      int default 0
is_featured     boolean default false  -- the one shown in homepage hero banner
created_at      timestamptz
updated_at      timestamptz

-- project_photos (1:N)
id              uuid pk
project_id      uuid references projects(id) on delete cascade
url             text
caption         text
sort_order      int

-- testimonials
id              uuid pk
author_name     text
author_role     text                 -- 'Buyer, Retreat 76'
body            text
photo_url       text
is_published    boolean default true
sort_order      int
created_at      timestamptz

-- site_settings (single row)
id              int pk default 1 check (id = 1)
phone           text
email           text
instagram_url   text
facebook_url    text
linkedin_url    text
youtube_url     text
x_url           text
updated_at      timestamptz

-- admin_users (managed via Supabase Auth UI; this is just a role map)
id              uuid pk references auth.users(id) on delete cascade
role            text default 'admin' check (role in ('admin','editor'))
```

**RLS posture** (matches the existing `leads` table):

- All tables: **RLS enabled.**
- `projects`, `project_photos`, `testimonials`, `site_settings`: **public-read** policies for `is_published`/published rows only. Static site & Next pages can fetch via the anon/publishable key.
- All writes: service-role only (server-side API routes the admin UI calls), gated by Supabase Auth check.
- `leads`: stays server-only as today.

## 5. Auth

- **Supabase Auth**, email + password. No public signup — admins are created by the owner from the Supabase dashboard (or a one-off seed script).
- The current shared-token `/leads?key=...` page becomes `/admin/leads`, gated by a real session.
- Middleware in `app/middleware.ts` redirects unauthenticated requests to `/admin/login`.
- Optional: role check (`admin` vs `editor`) — out of scope for v1 unless you ask.

## 6. Admin UI surface

Routes under `app/admin/`:

| Route | Purpose |
|---|---|
| `/admin/login` | Email + password login |
| `/admin` | Dashboard: counts (leads this week, projects, testimonials), quick links |
| `/admin/projects` | List + create |
| `/admin/projects/[id]` | Edit form: fields + photo uploader (drag/drop to Supabase Storage) + brochure upload + "Set as featured" toggle |
| `/admin/testimonials` | List + create + edit + publish toggle |
| `/admin/leads` | Replaces today's `/leads?key=…`. Table + status dropdown + CSV export |
| `/admin/settings` | Edit `site_settings` (phone, email, social URLs) |
| `/admin/logout` | Sign out |

Styling: match the existing site palette (ink + sage, the colors already in `truenest.css`). Keep it utilitarian, not flashy — it's a back-office.

## 7. Static-site integration

So the live GitHub Pages site stops being hand-coded for the dynamic pieces:

- New API routes on the Next app:
  - `GET /api/public/projects` → published projects (cached, edge)
  - `GET /api/public/projects/[slug]` → single project
  - `GET /api/public/testimonials` → published testimonials
  - `GET /api/public/featured-project` → the one project where `is_featured=true`
  - `GET /api/public/settings` → phone/email/social URLs
- The static HTML pages (`index.html`, `projects.html`, `retreat76.html`, etc.) get small bits of JS that fetch these endpoints and render the dynamic regions (project cards, the ongoing banner, testimonials, footer phone/social URLs).
- CORS is already configured to allow `https://ramanathan06.github.io`.
- Result: editors change content in `/admin`, the live site reflects it on next page load. No HTML edits, no redeploys.

For the eventual fuller port (the "migrate all 8 pages into Next") this is the on-ramp — the data is already there.

## 8. Build phases

Sized in working sessions, not calendar days.

| Phase | Deliverable | Effort |
|---|---|---|
| 0 | This plan + owner sign-off on tables + auth approach | done on approval |
| 1 | Supabase Auth turned on; first admin user seeded; SQL migrations for the 4 new tables + RLS policies; Storage buckets created | ~1 session |
| 2 | `/admin/login` + middleware gate; replace `/leads?key=…` with `/admin/leads` (auth-protected; same view) | ~1 session |
| 3 | `/admin/projects` CRUD + photo/brochure uploader; seed Retreat 76 + Hills & Skies from current HTML | ~2 sessions |
| 4 | `/admin/testimonials` CRUD + `/admin/settings` editor | ~1 session |
| 5 | Public read endpoints + wire `index.html`, `projects.html`, project pages, footer to consume them | ~2 sessions |
| 6 | Polish: lead status workflow, CSV export, dashboard counts | ~1 session |

**Total estimate: ~7–8 working sessions** for a feature-complete scoped admin. Lead-capture slice was ~1 session for comparison.

## 9. What this explicitly does NOT do

So expectations are clear:

- It does not port the story/careers/hero copy into the CMS (still HTML edits).
- It does not give a visual page builder.
- It does not give multi-user role management beyond a single `admin` role.
- It does not handle the brochure flipbook (separately deferred per owner instruction).
- It does not move the static site off GitHub Pages — the marketing pages stay on Pages, the dynamic regions just become CMS-fed.

If any of those become required later, each is an additive phase, not a rebuild.

## 10. Open decisions for the owner

Before Phase 1 starts, please confirm or change:

1. **Login model:** email + password, or magic link only? (Recommended: both — password for daily use, magic link for password resets.)
2. **Initial admin email(s):** which email address(es) become admin accounts?
3. **Multiple roles needed?** Just `admin`, or also a read-only `viewer` / content-only `editor`?
4. **Brochure delivery:** still skipped for now per earlier instruction — confirm this stays out of the CMS scope for v1?
5. **Asset migration:** can the existing project images stay where they are (`assets/images/`) until real assets arrive, or upload them into Supabase Storage as part of seeding so the admin owns them from day one?

Answer those and Phase 1 can start immediately.

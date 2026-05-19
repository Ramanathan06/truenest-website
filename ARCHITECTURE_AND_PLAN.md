# TrueNest Website — Architecture & Page-by-Page Plan

_Prepared for client approval · v1 · 2026-05-19_

This document translates the formal requirements (Requirements doc, 2026-05-18) into a buildable
architecture and a page-by-page specification. **Nothing in the full-stack build starts until this is
approved and the client's asset/content repo URL is provided.**

---

## 1. Goals (from requirements)

1. **Maximize time on the targeted/ongoing project** (Retreat 76) and convert visits → leads.
2. Cinematic landing: 4K hero video with zero buffering, resolving into an interactive
   ongoing-project banner.
3. Convey company soul/vision; tease all projects to drive clicks into project pages.
4. Each project gets its own rich page (info + photos).
5. Brochure download **gated** behind phone + email, rendered as a **flipbook**.
6. Social icons in every page footer.
7. **CMS-ready**, with a **database** (leads + content) and an **admin panel**.

---

## 2. Architecture

### 2.1 Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)** | SSR/SSG for SEO + speed; single codebase for site + API |
| CMS + Admin | **Payload CMS** (self-hosted, embedded in Next.js) | Gives the admin panel and content modeling out of the box; no separate service |
| Database | **Postgres** (managed: Neon or Supabase) | Stores leads + all CMS content; future-proof, relational |
| Media | Cloud storage (Vercel Blob or S3-compatible) + CDN | 4K video + project photos served from CDN, not the app |
| Hosting | **Vercel** | First-class Next.js hosting; edge CDN; replaces GitHub Pages (which cannot do gated downloads / admin / DB) |
| Email | Transactional provider (Resend/SES) | Lead notifications + brochure delivery |
| Styling | Tailwind (port existing tokens from `assets/js/tailwind.config.js`) | Reuse the approved design system — samples are NOT throwaway |

> **Why we leave GitHub Pages:** gated brochure, lead DB, and admin panel are all server-side.
> A static host cannot do any of them.

### 2.2 High-level diagram

```
                ┌──────────────────────────────────────────────┐
   Visitor ───▶ │  Next.js on Vercel (SSR/SSG + Edge CDN)        │
                │   ├─ Public pages (rendered from CMS content)  │
                │   ├─ /api/leads      (form + brochure gate)    │
                │   └─ /admin          (Payload admin panel)     │
                └───────┬───────────────────────┬────────────────┘
                        │                        │
                  ┌─────▼──────┐          ┌──────▼───────┐
                  │  Postgres  │          │ Blob/CDN      │
                  │  leads +   │          │ 4K video,     │
                  │  content   │          │ photos, PDFs  │
                  └────────────┘          └───────────────┘
                        │
                  ┌─────▼──────┐
                  │ Email svc  │  ← lead alerts + brochure link
                  └────────────┘
```

### 2.3 Data model (Payload collections)

- **Projects** — name, slug, status (ongoing/completed/upcoming), hero media, gallery[],
  description (rich text), specs (beds/area/price), location, amenities[], brochure (PDF),
  `isFeaturedOngoing` (drives the landing banner).
- **Leads** — name, phone, email, source page, project of interest, intent (brochure / inquiry /
  callback), createdAt, status (new/contacted/closed).
- **Pages** — editable content blocks for Story, Careers, etc. (so client edits copy without a dev).
- **SiteSettings** (global) — logo, social links, contact info, hero video reference.
- **Testimonials** — quote, name, role/project, photo.

### 2.4 Lead-gen & gated brochure flow

1. Visitor clicks **Download Brochure** on a project page.
2. Modal: name + phone + email (validated).
3. `POST /api/leads` → write to Postgres → fire email alert to TrueNest.
4. On success, open the **flipbook viewer** (page-turn rendering of the brochure) in-browser, and
   email a copy/link to the visitor.
5. All leads visible/filterable in the Payload admin panel.

### 2.5 4K hero, zero buffering

- Encode multiple renditions (HLS/adaptive or 4K + 1080p fallback), poster frame, `preload`.
- Serve from CDN, not the app server.
- After playback completes (or on reduced-data/mobile), swap to the **ongoing-project still
  banner** with interactive details — the pattern already prototyped in `index-sample-3.html`.

---

## 3. Design system

Port the approved sample (pending client's pick among `index-sample-1/2/3`) into the Next.js app.
Tokens already defined in `assets/js/tailwind.config.js`:

- **Surfaces:** deep ink `#0F0F0E` family
- **Text:** cream `#F5F0EB`
- **Secondary:** sage green `#8A9A7B`
- **Accent:** copper `#C17F59`, tertiary gold `#C9A96E`
- Logo is black/gray; avoid pure gold+black (AI cliché) — per prior design feedback.

> **Open decision for client:** which of the three samples is the base. Recommend
> `index-sample-3` (cinematic hero, gallery+lightbox, ROI calc) as it best matches the
> "maximize time on ongoing project" goal.

---

## 4. Page-by-page plan

### 4.1 Landing / Home `/`
- **Hero:** 4K video → resolves to **Retreat 76** (ongoing) interactive banner.
- **Soul/vision** strip — short brand statement.
- **Featured ongoing project** deep module: stats, CTA → Retreat 76 page + brochure gate.
- **All projects teaser grid** — cards linking to each project page.
- Testimonials carousel · CTA band · footer with social icons.
- _Data:_ Projects (featured + list), SiteSettings, Testimonials.

### 4.2 Project page `/projects/[slug]` (one per project)
- Hero media + status badge.
- Overview (rich text), specs, location/map, amenities, full **photo gallery + lightbox**.
- Optional virtual tour / ROI calculator (from sample-3).
- **Gated "Download Brochure"** → lead modal → flipbook.
- Sticky inquiry CTA.
- _Pages:_ Retreat 76 (priority), Hills & Skies, + future projects (CMS-driven, no new code).

### 4.3 Projects index `/projects`
- Filterable grid (ongoing / completed / upcoming), cards → project pages.

### 4.4 Story / About `/story`
- Brand narrative, founders, biophilic philosophy, Nandi Hills context. CMS-editable.

### 4.5 Testimonials `/testimonials`
- Full testimonial list (CMS collection).

### 4.6 Careers `/careers`
- Roles list + application form (writes to Leads/Applications collection).

### 4.7 Inquiries / Contact `/contact`
- Lead form (name/phone/email/message/project) → Postgres + email alert. Map + social.

### 4.8 Admin `/admin` (Payload)
- Client-facing: manage Projects, content, brochures, view/export **Leads**, site settings.

### 4.9 Global
- Header (shared) · Footer with **social icons on every page** · SEO meta + sitemap +
  `robots.txt` · analytics for time-on-page tracking (measures the core KPI).

---

## 5. Delivery phases

| Phase | Scope | Depends on |
|---|---|---|
| 0 | **This plan approved** + client asset/content repo URL received | Client |
| 1 | Next.js + Payload + Postgres scaffold on Vercel; design tokens ported; chosen sample as layout | Phase 0 |
| 2 | Landing + Retreat 76 project page + 4K hero pipeline | Assets |
| 3 | Lead capture + gated brochure flipbook + email | Phase 1 |
| 4 | Remaining pages (Story, Projects index, Testimonials, Careers, Contact) | Content |
| 5 | Admin hardening, SEO, analytics, performance pass (zero-buffer 4K), launch | All |

---

## 6. Open items needing client input

1. **Asset/content repo URL** (blocking all content work).
2. Which design sample is the base (recommend sample-3).
3. Final project list + which is the single "ongoing" focus (assumed Retreat 76).
4. Domain name + DNS access for Vercel.
5. Brochure source files (PDF/print-ready) for the flipbook.
6. Preferred email provider + the address that should receive lead alerts.

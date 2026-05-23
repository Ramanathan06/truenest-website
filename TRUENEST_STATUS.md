# TrueNest Website — Status & Next Steps

*Prepared 2026-05-21*

---

## ✅ What's done and live

- **All 8 pages live in production** (Home, Story, Projects, Retreat 76, Hills & Skies, Testimonials, Inquiries, Careers).
- **Hero on homepage** plays your 4 cinematic 1080p clips in sequence (~56s reel), then automatically reveals the Retreat 76 project banner.
- **All your project imagery integrated** — official logo, project elevations, interiors, story-page shots — pulled from your shared GitHub repo.
- **Lead capture working end-to-end:** every form submission (homepage CTA, Inquiries, Careers, "Request Brochure") is saved to a real database in real time.
- **Private leads admin** — TrueNest can view every lead via a secure link (name, email, phone, project, message, source, timestamp).
- **Social-media icons** in every page's footer.
- **Hosting**: GitHub Pages (public site) + Vercel in Mumbai (app & API) + Supabase Postgres (database). Industry-standard, secure, scalable.
- **CMS & admin-panel build plan** is drafted, ready for approval.

---

## 🔴 What we need from TrueNest

In priority order.

### 1. Remaining assets

Your GitHub repo gave us most of what we needed. Still missing:

- **Brochure PDF** for each project
- **4K master video** (the clips we have are 1080p — is 4K available, or is 1080p acceptable?)
- **Floor plans & spec sheets**
- **More project photos** (exteriors, amenities, unit interiors specific to each project)

### 2. Brand & contact

- The **5 real social-media profile URLs** (currently link to generic homepages)
- Confirm the footer **phone** (`+91 80 4455 9900`) and **email** (`hello@truenest.co.in`)

### 3. Admin-panel approval *(unblocks the biggest remaining build, ~7–8 sessions)*

Five quick decisions:

1. Login method — password, magic link, or both?
2. Which TrueNest email(s) become admin accounts?
3. One `admin` role, or also a read-only `viewer`?
4. Brochure flow — build into this admin, or separate?
5. Move existing images into admin storage during setup?

### 4. Brochure flow

- Download a PDF, view as a flipbook in-browser, or both?
- Form-gated (phone + email) or public?
- Any reference brochure flipbook you like?
*(Also blocked on the missing brochure PDF above.)*

### 5. Final copy & testimonials

- Final wording for Story / About, Careers, hero tagline, project descriptions
- Real testimonial quotes with names, roles, and photos

### 6. Brand-language decision *(new — surfaced after reading your `DESIGN.md`)*

The live site uses a sage/ink palette. Your `DESIGN.md` defines TrueNest's official brand as earthy stone + olive with EB Garamond + Metropolis fonts. Three options:

- **A.** Keep the current look (no extra work)
- **B.** Re-skin all 8 pages to match your `DESIGN.md` (~3–4 sessions)
- **C.** See a side-by-side preview first, then decide

### 7. Custom domain *(recommended for a luxury brand)*

Do you own `truenest.co.in` (or similar)? Which registrar? How should it map — combined, or `www` for the site and `app` for the admin?

### 8. Analytics, SEO, legal *(before public launch)*

- Analytics tool — GA4, Plausible, or none?
- Existing privacy policy & terms of use? (Legal counsel owns the wording. India's DPDP Act requires a privacy notice anywhere personal data is collected.)
- Cookie-consent banner needed?

---

## In one paragraph

The website's foundation is **live and production-ready**, with your real videos and imagery integrated, lead capture saving to a real database, and a private admin view for TrueNest. To wrap up, we need: the **brochure PDF + 4K master + floor plans + more photos** (the few assets not in your GitHub repo), **real social URLs and contact confirmation**, **five admin-panel decisions**, **brochure flow direction**, **final copy & testimonials**, a **decision on whether to re-skin to your `DESIGN.md` brand**, and ideally a **custom domain**. With these in hand, the remaining work finishes in a focused sprint.

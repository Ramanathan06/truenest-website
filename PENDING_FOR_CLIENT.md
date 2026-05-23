# TrueNest Website — Pending Work & Inputs Needed

**Status as of 2026-05-21**

The lead-capture system is **live in production**: forms on the public site (`ramanathan06.github.io/truenest-website`) save submissions to a Supabase database, accessible via a private admin view.

This doc lists what's still pending, in priority order, and exactly what we need from you (the client) to unblock each item.

---

## P1 🔴 — Real assets *(blocks everything visual)*

**Pending:** 4K hero video, brochure PDF, real photographs of Retreat 76 and Hills & Skies. The site currently uses 720p placeholder media.

**Why it matters:** The "cinematic luxury" positioning collapses with placeholder media. This blocks the 4K hero requirement and the project pages from looking real.

**We need from you:**
- Link to the GitHub repo with the 4K video, brochure, and project images (you referenced this in the original requirements).
- If not in GitHub: an alternative (Google Drive / WeTransfer / direct files).
- Confirmation the final brochure PDF is ready, or still being designed.

---

## P2 🔴 — Brand & contact details

**Pending:** Real social media profile URLs (Instagram, Facebook, LinkedIn, YouTube, X). Currently link to generic homepages. Also: confirm the footer phone (`+91 80 4455 9900`) and email (`hello@truenest.co.in`).

**Why it matters:** Anyone clicking a social icon today lands on `instagram.com`, not on TrueNest's profile. Free, instant fix.

**We need from you:**
- The 5 actual social profile URLs.
- Confirmation that the footer phone number and email are correct.
- Any other contact channel to include (WhatsApp Business? Calendly link?).

---

## P3 🟠 — CMS & proper admin panel

**Pending:** A full admin so the TrueNest team can manage Projects, Testimonials, Leads, and Site Settings (phone/email/social URLs) without a developer.

Today's admin is a single read-only leads page protected by a shared URL token — not a real login, no project / testimonial / settings management.

A detailed build plan is ready (`CMS_PLAN.md`). Estimated effort once approved: **~7–8 working sessions**.

**Why it matters:** Today, every project update / new testimonial / phone-number change requires the developer to edit HTML. The original requirements explicitly asked for "CMS-ready development" and an admin panel — this is the largest remaining piece.

**We need from you (5 decisions):**
1. **Login method** — email + password, magic link, or both? *(Recommended: both — password for daily use, magic link for resets.)*
2. **Initial admin emails** — which TrueNest team email(s) become admin accounts?
3. **Roles** — just one `admin` role, or also a read-only `viewer` / content-only `editor`?
4. **Brochure** — confirm it stays skipped from CMS v1 (per earlier instruction), or now back in scope?
5. **Existing images** — migrate them into Supabase Storage during setup (so the admin "owns" them from day one), or leave in the current folder until real assets arrive?

---

## P4 🟡 — Brochure download flow (flipbook + phone-gating)

**Pending:** "Request Brochure" buttons currently collect name + email only and don't actually deliver a brochure — they just file a lead. The original requirement was to collect **phone + email**, then unlock a **flipbook-style** PDF viewer (page-turn / book model).

**Why it matters:** This is the conversion funnel's payoff. Without it, leads come in but visitors leave empty-handed and the "request brochure" CTA is a soft promise.

**We need from you:**
- Delivery model: download a PDF, view as flipbook in-browser, or both?
- Should the brochure be **gated** (form-required) or **public**?
- Any preferred flipbook style / reference site you've seen and liked?
- Should we distinguish brochure-request leads from general inquiries for follow-up? *(Already supported in the database — just needs the UI to flag it.)*

---

## P5 🟡 — Long-form copy & testimonials

**Pending:** All long-form copy on the site (Story / About, Careers descriptions, hero tagline, each project's long description) is the developer's best-guess placeholder. Testimonials page has no real quotes.

**Why it matters:** Low effort, high visible value — but only TrueNest can write in TrueNest's voice. Not technically blocking, but visitors see the placeholder text today.

**We need from you:**
- Final copy for: Story / About page, Careers job descriptions, hero tagline, each project's long description.
- Tone-of-voice references (any existing brand book or past marketing material).
- Real testimonial quotes + author names + photos.

---

## P6 🟢 — Custom domain

**Pending:** The site currently lives at `ramanathan06.github.io/truenest-website` (public) and `truenest-website-8lbx.vercel.app` (app). Original requirements don't mention a custom domain, but for a luxury brand it's expected.

**Why it matters:** Cosmetic but important for credibility. Setup takes minutes once we have the domain.

**We need from you:**
- Do you own a domain (e.g. `truenest.co.in`)? If yes, which registrar?
- How should it map?
  - `www.truenest.co.in` → public marketing site
  - `app.truenest.co.in` → admin
  - or one combined domain.

---

## P7 🟢 — Analytics, SEO, legal

**Pending:** No analytics tool installed, minimal SEO meta tags, no privacy policy / terms of use / cookie banner.

**Why it matters:** Without analytics, conversion tracking is guesswork. India's DPDP Act technically requires a privacy notice anywhere personal data (phone, email) is collected — which the lead forms do.

**We need from you:**
- Preferred analytics tool — GA4? Plausible? None?
- Existing privacy policy & terms of use? *(Your legal counsel owns the wording, not us.)*
- Cookie consent banner needed? *(Higher priority if EU traffic is expected; lower if mostly Indian buyers.)*

---

## ✅ What's already done & live

So you can speak to it confidently in the meeting:

- 8-page marketing site live on GitHub Pages (Home, Story, Projects, Retreat 76, Hills & Skies, Testimonials, Inquiries, Careers).
- Lead capture working end-to-end: live forms → Vercel API → Supabase Postgres.
- Token-gated leads admin view (private link).
- Social media icons in every footer.
- Hero video plays once then auto-reveals the ongoing-project (Retreat 76) banner.
- CORS, validation, and production deployment in Mumbai region (low latency for Indian users).
- Database secured with row-level security (the public browser cannot read or write the leads table directly).

---

## One-paragraph summary for the client meeting

> "The lead-capture system is live in production — forms on the website now save to a real database and we can view submissions in a private admin. To finish the project we need from TrueNest: (1) the 4K video, brochure, and real project photos (the GitHub repo you mentioned), (2) the real social profile URLs and confirmation of the footer phone & email, (3) five quick decisions on the admin panel (we have a detailed plan ready), (4) direction on the brochure flow — flipbook + phone-gated download, (5) the final long-form copy and testimonials, and (6) the custom domain if you want one. Once those are in, the remaining build can be wrapped in a few focused sessions."

# Barnängshuset — Content Checklist

Everything on this list must be replaced before the site goes live.
All items are editable in the Sanity Studio at `/studio`.

The brief's §11 is the source of truth. This is the actionable version.

---

## 🔴 Blockers — cannot launch without these

### 1. Leasing agent (Studio → Site Settings → Leasing Contact)
- [ ] **Name** — replace "Anna Lindqvist"
- [ ] **Role** — replace "Leasing Manager"
- [ ] **Email** — replace `anna@barnangshuset.se`
- [ ] **Phone** — replace `+46 70 000 00 00`
- [ ] **Photo** — upload a real headshot (shown in the Viewing section and footer)
- [ ] **Cal.com link** — if using calendar booking, paste the URL here

### 2. Testimonial (Studio → Home Page → sections → Testimonial)
- [ ] **Quote** — the Spotify quote is fabricated. Replace with a real, attributed quote from an actual tenant, with their written permission.
- [ ] **Author name** — real person's name
- [ ] **Author role** — e.g. "Creative Director, Studio Name"
- [ ] **Wide image** — upload a real building or tenant image
- [ ] **Project card image** — upload an image of the tenant's space or work

### 3. Hero image (Studio → Home Page → sections → Hero)
- [ ] **Hero image** — upload real building photography. The placeholder is a stock image.
- [ ] **OR Hero video** — if using video, switch media type to "Video" and paste the MP4 URL (host on S3/CloudFront or Mux). Always provide a poster image fallback.

### 4. Floor plans (Studio → Floors / Units)
- [ ] **Floor 1 plan image** — upload the actual architectural floor plate as an image
- [ ] **Floor 2 plan image** — same
- [ ] **Verify areas** — confirm 300m² is accurate per floor
- [ ] **Verify ceiling heights** — confirm 4.9m
- [ ] **Verify capacities** — confirm headcount per floor
- [ ] **Verify orientations** — confirm "South-west" / "North-east" descriptions
- [ ] **Update features** — replace placeholders with real building features
- [ ] **Status** — when a floor is leased/reserved, update status here. The availability bar and floor plan colours update automatically.

> The SVG floor plan geometry is currently schematic. When you have the actual architectural drawings, trace real `<path>` elements from the DWG/PDF and replace the schematic rectangles in `FloorPlanInteractive.tsx`.

---

## 🟡 Important — should fix before launch

### 5. Building photography (all sections)
Real photos are needed for:
- Hero (blocked above)
- Intro / Statement — the editorial image (Studio → Home Page → Statement section → Parallax image)
- Testimonial wide image (blocked above)
- Journal post covers (see §8)

### 6. Neighbourhood POIs (Studio → Neighbourhood POIs)
- [ ] Verify all 8 walking times against Google Maps walking directions from Nackagatan 4
- [ ] Verify all 8 lat/lng coordinates (used for the Maptiler map markers)
- [ ] Add or remove POIs as needed — the list and map stay in sync automatically
- The current 8 POIs are reasonable guesses. Any that are wrong will erode trust.

### 7. Journal posts (Studio → Journal)
Replace all 3 placeholder posts with real content:
- [ ] Post 1: title, date, category, cover image, excerpt, body
- [ ] Post 2: same
- [ ] Post 3: same
- More posts can be added at any time — the journal section always shows the 3 most recent.

### 8. Contact details & social links (Studio → Site Settings)
- [ ] **Address** — confirm "Nackagatan 4, 116 40 Stockholm" is correct
- [ ] **Coordinates** — confirm lat/lng for the map building pin
- [ ] **Social links** — add real Instagram, LinkedIn etc.
- [ ] **Newsletter webhook** — if using Resend/Mailchimp/Buttondown, paste the webhook URL

---

## 🟢 Nice to have — can launch without, add post-launch

### 9. Pricing (deliberate decision needed)
Currently: no price signal anywhere on the site.
Options:
- **Keep enquiry-only** — current state. Works for high-end leasing.
- **Add a range** — e.g. "from X SEK/m²/year" — add a `priceRange` field to the floor document.
- **Add a note** — e.g. "Pricing on application" — add to the viewing section body text.

This is a business decision, not a content update. Decide consciously.

### 10. Brochure PDF
- [ ] Upload the sales brochure PDF somewhere (S3/CloudFront or Sanity file asset)
- [ ] Add a "Download full specifications" link — good candidate for the floor plan detail panel

### 11. Hero video (if going video route)
- [ ] Commission/edit a muted, looping MP4 (target: 10–20 seconds, <5MB)
- [ ] Host on AWS S3 + CloudFront or Mux
- [ ] In Studio: Hero section → Media type → Video, paste URL, upload poster image

### 12. Footer & meta copy (Studio → Site Settings)
- [ ] **Footer invite** — "Work somewhere worth coming back to." — edit or confirm this is right
- [ ] **Meta title** — confirm the page title
- [ ] **Meta description** — write the real description for Google/social shares
- [ ] **OG image** — upload a 1200×630 image for social sharing

### 13. Privacy policy
A GDPR-required page. Either:
- Link to an external policy (simplest)
- Create `/app/privacy/page.tsx` with the policy text

The newsletter form references "see our privacy policy" — this link needs to go somewhere real before launch.

### 14. Analytics (optional)
If you want analytics:
- **Plausible** or **Fathom** — privacy-friendly, no cookie banner required in EU
- Do NOT use GA4 without a cookie consent banner
- Add the script tag to `layout.tsx` or use their Next.js packages

---

## How to update content in the Studio

1. Go to `localhost:3000/studio` (dev) or `yourdomain.com/studio` (production)
2. Log in with your Sanity account
3. Navigate to the document you want to edit
4. Save → the site revalidates automatically within 60 seconds (ISR)

For immediate updates in production, set up the Sanity webhook (Stage 9) which triggers instant revalidation on every publish.

---

## Placeholder inventory (the complete list from PRODUCTION-BRIEF.md §11)

| Item | Location in Studio | Status |
|---|---|---|
| Leasing agent | Site Settings → Leasing Contact | ⏳ Replace |
| Testimonial quote | Home Page → Testimonial | ⏳ Replace |
| Testimonial author | Home Page → Testimonial | ⏳ Replace |
| Hero image | Home Page → Hero | ⏳ Replace |
| Floor plan geometry (SVG) | Code: `FloorPlanInteractive.tsx` | 🔧 Dev work |
| Floor plan images | Floors → Floor 1 / Floor 2 | ⏳ Upload |
| Intro image | Home Page → Statement | ⏳ Replace |
| Journal post 1 | Journal | ⏳ Replace |
| Journal post 2 | Journal | ⏳ Replace |
| Journal post 3 | Journal | ⏳ Replace |
| POI coordinates | Neighbourhood POIs | ⏳ Verify |
| POI walking times | Neighbourhood POIs | ⏳ Verify |
| Social links | Site Settings | ⏳ Add |
| Pricing decision | — | 💬 Decision needed |
| Privacy policy | — | ⏳ Create |
| OG share image | Site Settings → SEO | ⏳ Upload |
| Meta description | Site Settings → SEO | ⏳ Write |
| Brochure PDF | — | ⏳ Upload |
| Footer invite | Site Settings → Footer invite | ✅ Editable |
| Building body copy | Home Page → Statement → Body paragraphs | ✅ Editable |

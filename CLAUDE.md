# CLAUDE.md — Barnängshuset

Standing instructions for this project. Read this fully before doing anything.
For the complete spec, read `PRODUCTION-BRIEF.md`. The working prototype is
`barnangshuset-complete.html` — the pixel-accurate visual/interaction target.

## What this is

A production website for **Barnängshuset**, a commercial office-leasing site for a
restored 1917 cotton/textile mill at Nackagatan 4, Södermalm, Stockholm. The site
sells calm, focused workspace to founders, studios, and small teams who want depth
over speed. Owner: PPP Group.

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind v4 + CSS custom-property
tokens · Sanity CMS · Lenis + GSAP · deployed on AWS.

## The one idea everything serves

The site has to be **serene without being sleepy, and persuasive without being loud.**
Both are achieved through craft — typography, space, timing — never through addition.
The restraint IS the product. The building's whole proposition is that it's a calm
place to do good work, away from the noise; a site that shouts would be lying about
what it sells.

When tempted to make something "pop more," the answer is almost always better
typography, more space, more precise timing — NOT a bigger graphic or a louder color.

## Non-negotiable rules

### 1. Design tokens — never hardcode a value
Every color, type size, space, and motion curve resolves to a token. The token layer
(`:root` custom properties, exposed to Tailwind via `@theme inline`) is the single
source of truth. If you're typing a hex code into a component, you're doing it wrong.

### 2. Palette hierarchy (this is a frequent failure point)
- **Grounds:** olive (`--c-olive #3D3928`), the stone/earth family, and the papers
  (`--c-paper #FAF7F3`, `--c-paper-2 #F5F2EB`), plus near-black ink (`--c-ink #12100D`)
  for hero/footer.
- **Green (moss `#4E6646` / sage `#8E9E6C`): HIGHLIGHT ONLY.** Never a background.
  Labels, small accents, active map/floor states only.
- **Coral (`--c-coral #C9725D`): RARE punctuation.** CTAs, the availability bar,
  active states, one or two highlighted words. Its power is its scarcity. If coral
  is everywhere, it means nothing.

### 3. Progressive enhancement — mandatory
Content is **server-rendered and visible by default.** Animation layers on AFTER
hydration via a `.js` class on `<html>`. NEVER hide content with CSS and rely on a
script to reveal it — that produces a blank page when anything upstream fails.
- Base CSS: text and images visible, opacity 1.
- `.js [data-fade]{opacity:0}`, `.js .mask>span{transform:translateY(110%)}`,
  `.js .reveal-img{clip-path:inset(0 0 100% 0)}` — hidden ONLY when JS is confirmed.
- The page must be complete and readable with JavaScript disabled.

### 4. Section order and ground rhythm are deliberate
Order: hero (black) → intro (paper) → key figures (paper) → testimonial (paper-2) →
floor plan (olive) → neighbourhood map (paper) → journal (paper-2) → viewing (olive)
→ footer (ink), with the sticky availability bar fixed over everything.

The alternating grounds (the two olive sections break the paper runs) stop the page
reading as one long undifferentiated scroll. Preserve the rhythm.

### 5. Motion is restrained
Long, unhurried durations (0.9–1.5s). Gentle easing (`--ease-soft`,`--ease-mask`).
Motion drifts and settles; it never snaps or performs. Everything respects
`prefers-reduced-motion` (collapse to ~0). When in doubt: slower and less.

### 6. Images go through Sanity + next/image — NEVER base64
The prototype inlines images as base64 data URIs. That is a PROTOTYPE-ONLY
convenience. In production, images are Sanity CDN assets rendered through
`next/image` (responsive sizes, WebP/AVIF, lazy loading). Do not carry base64
inlining into production — it's a major performance regression.

## Content is CMS-driven — placeholders are NOT final

Much of the prototype is placeholder. Build everything as Sanity-driven components;
do not bake placeholder values in as if final. Known placeholders to replace
(see brief §11): the fabricated Spotify testimonial, the leasing agent "Anna
Lindqvist", AI-generated imagery, schematic floor-plan rectangles, the three journal
posts, the neighbourhood POIs and walk-times, pricing (currently absent — a
conscious decision is needed).

Editors must be able to, without a developer: flip a floor available→leased, publish
a journal post, reorder/toggle sections, swap the hero between image and video.

## How to work in this repo

- **Build in stages, verify each before the next.** Follow the brief's §12 sequence:
  scaffold → tokens+fonts → Sanity schema → static SSR sections → animation →
  interactive pieces → forms → SEO/perf/a11y/GDPR. Never build the whole site in
  one pass — it becomes undebuggable.
- **The static baseline comes before animation.** Confirm the page renders complete
  and correct with JS disabled before layering motion on top.
- **Check work against the prototype** at each stage — it's the visual target.
- **When the brief and the prototype disagree, the brief wins** (it's the later,
  agreed artifact; e.g. the prototype's base64 images, the removed custom cursor).
- **Surface ambiguity, don't paper over it.** If a decision is unclear, ask rather
  than inventing — especially on the palette, the content model, and anything
  touching real availability/pricing data.

## Context: Sweden / EU

GDPR applies. Newsletter is double opt-in. Privacy-friendly analytics (Plausible /
Fathom) over GA4. Currently English-first; if Swedish is wanted, plan i18n
(next-intl + localized Sanity fields) up front, not as a retrofit.

## The interactive pieces (brief §7 for detail)

- **Floor plan:** SVG units, hover/click → detail panel, status-driven colors. Replace
  the prototype's hand-placed rectangles with real plate geometry; the logic ports.
- **Neighbourhood map:** replace the schematic SVG with Mapbox GL, custom paper-toned
  style (NOT default Google blue), markers from `poi` docs, hover-synced with the list,
  building as the coral center pin.
- **Sticky availability bar:** appears after ~60% of first viewport, dismissible
  (sessionStorage), count pulled live from `floor` docs where status==available.
  "2 floors **remaining**" — the scarcity must always be TRUE.
- **Viewing/booking:** the named agent from `siteSettings` is the human face. Wire the
  CTA to a real path (mailto → form → Cal.com embed, simplest to best-converting).

## Persuasion philosophy (for any sales-facing copy or component)

Every persuasion lever must be true or it curdles. "2 floors remaining" when 2 remain
is the news; a fake countdown is a lie. Prefer facts over adjectives, a human over a
banner, real scarcity over manufactured urgency. The sales pieces (figures band,
availability bar, named agent, map) exist to prove you can give real conversion power
without raising the site's voice. Hold that line.

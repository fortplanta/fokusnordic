# Scrolling gallery, information registers, and area map — design QA

## Evidence

- Gallery reference: `/var/folders/55/58r0fmnj6yx3cxl1s2ws5s6m0000gn/T/codex-clipboard-d63380f9-3583-435d-9c3e-b7743c0d16d1.png`
- Gallery implementation: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/mosaic-gallery-implementation.png`
- Gallery comparison: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/mosaic-gallery-comparison.png`
- Map reference: `/var/folders/55/58r0fmnj6yx3cxl1s2ws5s6m0000gn/T/TemporaryItems/NSIRD_screencaptureui_l6aAxs/Screenshot 2026-09-02 at 20.25.08.png`
- Map implementation: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/area-map-implementation.png`
- Map comparison: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/area-map-comparison.png`
- Desktop viewport: 1389 × 1204. Mobile check: 390 × 844.

## Findings

No actionable P0, P1, or P2 mismatch remains.

- Gallery composition: the implementation reproduces the reference's long editorial scroll, alternating edge alignment, deliberately uneven image scale, large areas of negative space, and small captions. It uses the project's own imagery, typography, colors, and spacing tokens.
- Information hierarchy: both Light and volume registers now place each label above its paragraph or list. Item-level divider rules were removed; spacing alone creates the grouping.
- Map composition: the implementation follows the reference's list-left/map-right structure, with a static Sanity image and percentage-positioned linked markers layered above it.
- CMS ownership: gallery order, image, caption, and layout are editable. Map image, heading, marker name, detail, category, URL, and X/Y position are editable.
- Responsiveness: the mosaic becomes a controlled single stream on mobile, the map and list stack, and both information registers remain single-column. No horizontal overflow was detected.
- Accessibility: map markers have descriptive accessible names and link back to their corresponding list entry; location text remains available outside the image.

## Verification

- Six gallery items rendered.
- Eight area-map markers and eight matching list items rendered.
- The map follows the Address section in the DOM.
- Zero item-level divider rules remain in either Light and volume register.
- Production build and TypeScript passed.
- Sanity schema deployed and current `homePage` content populated.

## P3 follow-up

- The temporary static map plate is cropped from the supplied reference and therefore still contains its original printed markers underneath the live overlays. The map image is independently replaceable in Sanity; replacing it with the final clean exported map will not require code changes.

final result: passed

---

# Floor-plan selector — design QA

## Evidence

- Source design: `/var/folders/55/58r0fmnj6yx3cxl1s2ws5s6m0000gn/T/codex-clipboard-40c67636-98cc-405a-bf34-8e475212b854.png`
- Implementation: `http://localhost:3000/?preview=floor-plan-v3#floor-plans`
- Source viewport: 3840 × 2160. Implementation checked in the Codex in-app browser at desktop width.
- State checked: Suite 1, ground floor and mezzanine.

## Comparison history

- Pass 1 — P1: the earlier aubergine full-section composition did not match the supplied white-ground three-column grid.
- Pass 2 — P1: an inherited desktop CTA introduced an unintended oversized shape in the information column.
- Pass 3: the CTA was removed and the source grid was reproduced: information/navigation at left, aligned AXO plates in the narrow middle column, and two equal floor-plan fields at right.

## Final comparison

No actionable P0, P1, or P2 mismatch remains.

- Grid: the desktop column boundaries, two-row structure, gutters, and top/bottom alignment follow the source composition.
- Typography: the existing site heading, label, and body tokens are reused; no floor-plan-specific type scale was introduced.
- Content: production floor-plan SVGs occupy the two right-hand fields in place of the source mockup's placeholder labels.
- Controls: only the source design's count, Previous, and Next controls remain beneath the suite title; pagination dots are removed. Arrow-key and swipe navigation remain available.
- Proportions: AXO canvases use the source's compact portrait ratio (approximately 0.86), while both plan canvases use the source's wide ratio (approximately 1.68); neither column stretches to the viewport height.
- Information: the three Suite 1 tables shown in the source are CMS-backed and populated with the supplied area, room, and seating values.
- Theme: the completed grid is presented on the established aubergine section ground with inverse text and inverse rules; plan artwork remains on its white drawing sheets for legibility.
- Heading: the suite name uses the shared `section-display` H2 treatment and Petit Serif font used by the other section headings.
- CMS data: all seven suites contain their own PDF-derived area, room, and seating tables. Automated verification compares every displayed label and value with the supplied PDF transcription.
- Responsive behavior: below the existing mobile breakpoint, the same content becomes a single reading sequence: title/controls, ground-floor AXO, ground-floor plan, mezzanine AXO, mezzanine plan, then details and CTA. Touch targets retain the project's mobile control sizing.
- Accessibility: the suite selector exposes current state, named controls, and a labelled plan group; all plans and AXOs retain descriptive alternative text.

## Verification

- Production build and TypeScript passed.
- Sanity verification passed against `wvgj6m8r/production`.
- Desktop rendering was visually compared with the supplied source in the in-app browser.
- CSS and component diff passed whitespace validation.

final result: passed

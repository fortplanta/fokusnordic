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

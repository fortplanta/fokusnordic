# Conditions grid and categorized register — design QA

## Evidence

- Source visual truth: `/var/folders/55/58r0fmnj6yx3cxl1s2ws5s6m0000gn/T/codex-clipboard-d26cdbb0-cb6d-416b-ba0d-05a1a094fe1e.png`
- Browser-rendered implementation: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-categorized-implementation.png`
- Browser-rendered conditions grid: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/conditions-grid-implementation.png`
- Side-by-side comparison: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-categorized-comparison.png`
- Reference pixels: 3452 × 1952, normalized to the implementation viewport for comparison.
- Implementation viewport: 1389 × 1204 at device density 1.
- State: the complete four-by-two conditions grid followed by the Light and volume register.

The grid viewport shows all eight image-led conditions at once. The following register was checked separately in the same browser session.

## Findings

No actionable P0, P1, or P2 mismatch remains.

- Fonts and typography: the source hierarchy is reproduced with the project's existing display and sans families rather than importing the reference brand's fonts. The lead remains dominant; labels are small, uppercase, and optically distinct from body copy.
- Spacing and layout rhythm: the source's full-width lead, quiet left column, offset right-hand register, horizontal rules, and two-column category rhythm are retained. The supplied information is denser than the source, so the implementation continues vertically rather than compressing the type.
- Colors and tokens: the section uses the existing Barnängshuset paper/blush, ink, muted-text, rule, spacing, and type tokens. No new palette was introduced.
- Image quality: each condition has a real Sanity-owned image, rendered through `next/image`. The image field is editable independently for every item.
- Copy and content: the eight supplied editorial statements form a separate four-by-two grid above the facts register. The 25 technical specifications remain bundled into six editable Sanity categories. Field labels remain available as editorial metadata in Sanity but are intentionally omitted from the public register because the values are self-explanatory.
- Responsiveness: the condition cards become two columns at tablet width and a single sequence at 390 × 844; no horizontal overflow occurs.
- Accessibility: each condition is a semantic article with a heading and non-interactive image. The presentation does not imply clickability.

## Primary checks

- Desktop rendering inspected at 1389 × 1204.
- Mobile rendering inspected at 390 × 844.
- Eight condition cards, eight images, six specification categories, and zero accordion elements confirmed in the browser.
- Desktop grid confirmed as four equal columns; mobile confirmed as a single sequence.
- Browser console checked with no errors or warnings attributable to the section.
- Sanity schema deployed and the current `homePage.volume` document populated.

## Comparison history

The first revision placed the editorial conditions inside an accordion. The current version separates the visual conditions from the formal property register, giving each content type the amount of attention it needs.

## Follow-up polish

- P3: Two migrated cards currently reuse the same source image. Every card image is independent in Sanity and can be replaced as soon as a more specific asset is selected.

final result: passed

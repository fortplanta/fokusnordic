# Lower-page Light and volume register — design QA

## Evidence

- Source visual truth: `/var/folders/55/58r0fmnj6yx3cxl1s2ws5s6m0000gn/T/codex-clipboard-d26cdbb0-cb6d-416b-ba0d-05a1a094fe1e.png`
- Browser-rendered implementation: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-categorized-implementation.png`
- Browser-rendered restored section: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-restored-lower-section.png`
- Side-by-side comparison: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-categorized-comparison.png`
- Reference pixels: 3452 × 1952, normalized to the implementation viewport for comparison.
- Implementation viewport: 1389 × 1204 at device density 1.
- State: the complete editorial conditions list in the section immediately before Viewing.

The viewport shows all eight editorial conditions in the right-hand list. The technical register continues below and was checked in the same browser session.

## Findings

No actionable P0, P1, or P2 mismatch remains.

- Fonts and typography: the source hierarchy is reproduced with the project's existing display and sans families rather than importing the reference brand's fonts. The lead remains dominant; labels are small, uppercase, and optically distinct from body copy.
- Spacing and layout rhythm: the source's full-width lead, quiet left column, offset right-hand register, horizontal rules, and two-column category rhythm are retained. The supplied information is denser than the source, so the implementation continues vertically rather than compressing the type.
- Colors and tokens: the section uses the existing Barnängshuset paper/blush, ink, muted-text, rule, spacing, and type tokens. No new palette was introduced.
- Image quality: the rejected image-card treatment has been removed; this section is intentionally typographic.
- Copy and content: the eight supplied editorial statements are restored as a two-column list on the right, with the introduction on the left. The 25 technical specifications remain bundled into six editable Sanity categories below the statements.
- Responsiveness: both right-hand lists become a single sequence at 390 × 844; no horizontal overflow occurs.
- Accessibility: each condition remains a semantic article with a heading and paragraph. There are no controls or implied interactions.

## Primary checks

- Desktop rendering inspected at 1389 × 1204.
- Mobile rendering inspected at 390 × 844.
- Eight condition statements, six specification categories, zero cards, and zero accordion elements confirmed in the browser.
- The section is immediately before Viewing in the rendered DOM.
- Desktop list confirmed as two columns; mobile confirmed as a single sequence.
- Browser console checked with no errors or warnings attributable to the section.
- Sanity schema deployed and the current `homePage.volume` document populated.

## Comparison history

The image-card experiment was removed. The current version returns to the earlier editorial register and relocates it near the end of the page, where it works as detailed substantiation before the viewing invitation.

## Follow-up polish

- No open visual follow-up remains for this change.

final result: passed

# Split Light and volume sections — design QA

## Evidence

- Source visual truth: `/var/folders/55/58r0fmnj6yx3cxl1s2ws5s6m0000gn/T/codex-clipboard-d26cdbb0-cb6d-416b-ba0d-05a1a094fe1e.png`
- Browser-rendered implementation: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-categorized-implementation.png`
- Browser-rendered editorial section: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-editorial-third-section.png`
- Side-by-side comparison: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-categorized-comparison.png`
- Reference pixels: 3452 × 1952, normalized to the implementation viewport for comparison.
- Implementation viewport: 1389 × 1204 at device density 1.
- State: editorial conditions in the third section; technical specifications immediately before Viewing.

The viewport shows the complete third section: a three-column introduction, one-column gap, and eight-column editorial list. The separate technical section was checked near the bottom in the same browser session.

## Findings

No actionable P0, P1, or P2 mismatch remains.

- Fonts and typography: the source hierarchy is reproduced with the project's existing display and sans families rather than importing the reference brand's fonts. The lead remains dominant; labels are small, uppercase, and optically distinct from body copy.
- Spacing and layout rhythm: the source's full-width lead, quiet left column, offset right-hand register, horizontal rules, and two-column category rhythm are retained. The supplied information is denser than the source, so the implementation continues vertically rather than compressing the type.
- Colors and tokens: the section uses the existing Barnängshuset paper/blush, ink, muted-text, rule, spacing, and type tokens. No new palette was introduced.
- Image quality: the rejected image-card treatment has been removed; this section is intentionally typographic.
- Copy and content: the third section contains only the eight editorial conditions. The lower section contains only the six technical specification categories. Both draw from distinct arrays inside the same Sanity section object.
- Layout ratio: both sections use three of twelve columns for the heading and introduction, leave one column empty, and give the information grid the remaining eight columns.
- Responsiveness: both sections place the introduction before a single-column information sequence at 390 × 844; no horizontal overflow occurs.
- Accessibility: each condition remains a semantic article with a heading and paragraph. There are no controls or implied interactions.

## Primary checks

- Desktop rendering inspected at 1389 × 1204.
- Mobile rendering inspected at 390 × 844.
- The editorial section is the third `main` section and contains eight statements with zero technical categories.
- The technical section is immediately before Viewing and contains six categories with zero editorial statements.
- Desktop information areas measured at eight grid columns; mobile confirmed as a single sequence.
- Browser console checked with no errors or warnings attributable to the section.
- Sanity schema deployed and the current `homePage.volume` document populated.

## Comparison history

The previously combined register is now split by purpose: experiential building conditions appear early, while formal property data acts as detailed substantiation before the viewing invitation.

## Follow-up polish

- No open visual follow-up remains for this change.

final result: passed

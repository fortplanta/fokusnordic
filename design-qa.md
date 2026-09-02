# Categorized Light and volume register — design QA

## Evidence

- Source visual truth: `/var/folders/55/58r0fmnj6yx3cxl1s2ws5s6m0000gn/T/codex-clipboard-d26cdbb0-cb6d-416b-ba0d-05a1a094fe1e.png`
- Browser-rendered implementation: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-categorized-implementation.png`
- Side-by-side comparison: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-categorized-comparison.png`
- Reference pixels: 3452 × 1952, normalized to the implementation viewport for comparison.
- Implementation viewport: 1389 × 1204 at device density 1.
- State: the top of the Light and volume section, first architectural condition expanded.

The full viewport shows the heading, introductory column, accordion, categorized register, typography, and rules. The lower register continues below the viewport by design and was checked directly in the rendered page.

## Findings

No actionable P0, P1, or P2 mismatch remains.

- Fonts and typography: the source hierarchy is reproduced with the project's existing display and sans families rather than importing the reference brand's fonts. The lead remains dominant; labels are small, uppercase, and optically distinct from body copy.
- Spacing and layout rhythm: the source's full-width lead, quiet left column, offset right-hand register, horizontal rules, and two-column category rhythm are retained. The supplied information is denser than the source, so the implementation continues vertically rather than compressing the type.
- Colors and tokens: the section uses the existing Barnängshuset paper/blush, ink, muted-text, rule, spacing, and type tokens. No new palette was introduced.
- Image quality: the replacement section contains no imagery, matching the requested facts-first treatment; no placeholder or fabricated asset is present.
- Copy and content: the eight supplied editorial statements form an accordion on the left. The 25 technical specifications are bundled into six editable Sanity categories on the right. Field labels remain available as editorial metadata in Sanity but are intentionally omitted from the public register because the values are self-explanatory. The existing kicker, headline, and introduction remain editable.
- Responsiveness: at 390 × 844 the accordion and register become a single-column sequence and produce no horizontal overflow.
- Accessibility: native `details`/`summary`, semantic category headings, and definition lists preserve keyboard operation and document structure; labels do not depend on color alone.

## Primary checks

- Desktop rendering inspected at 1389 × 1204.
- Mobile rendering inspected at 390 × 844.
- Eight accordion items, six specification categories, and exactly one open accordion item confirmed in the browser.
- Switching accordion items closes the previous item and does not shift the right-hand register.
- Browser console checked with no errors or warnings attributable to the section.
- Sanity schema deployed and the current `homePage.volume` document populated.

## Comparison history

The earlier flat register treated every supplied fact as an equal item. The revised comparison confirms the requested hierarchy: editorial conditions on the left and grouped, scannable property facts on the right.

## Follow-up polish

- P3: The supplied content makes the completed section taller than the reference. This is an intentional information-density difference; categories and facts can be shortened or reordered directly in Sanity later.

final result: passed

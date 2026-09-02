# Light and volume information register — design QA

## Evidence

- Source visual truth: `/var/folders/55/58r0fmnj6yx3cxl1s2ws5s6m0000gn/T/codex-clipboard-a54e6dce-c12e-473a-90d5-e4ea086a95b2.png`
- Browser-rendered implementation: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-information-implementation.png`
- Side-by-side comparison: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/volume-information-comparison.png`
- Reference pixels: 2710 × 1530, normalized to 1440 × 1000 on a white comparison canvas.
- Implementation pixels: 1440 × 1000 at a 1440 × 1000 CSS viewport and device density 1.
- State: the top of the Light and volume section, all primary building-condition entries loaded.

The full viewport clearly shows the heading, introductory column, register grid, typography, rules, and six of eight primary statements. A separate focused crop was not needed because these elements remain readable in the normalized comparison; the longer technical register was checked directly in the rendered page.

## Findings

No actionable P0, P1, or P2 mismatch remains.

- Fonts and typography: the source hierarchy is reproduced with the project's existing display and sans families rather than importing the reference brand's fonts. The lead remains dominant; labels are small, uppercase, and optically distinct from body copy.
- Spacing and layout rhythm: the source's full-width lead, quiet left introduction, offset right-hand register, horizontal rules, and two-column information rhythm are retained. The implementation intentionally extends vertically because it contains substantially more supplied information than the source.
- Colors and tokens: the section uses the existing Barnängshuset paper/blush, ink, muted-text, rule, spacing, and type tokens. No new palette was introduced.
- Image quality: the replacement section contains no imagery, matching the requested facts-first treatment; no placeholder or fabricated asset is present.
- Copy and content: all eight supplied editorial statements and all 25 technical specifications are populated from Sanity-backed arrays. The existing kicker, headline, and introduction remain editable.
- Responsiveness: at 390 × 844 the register becomes a single-column sequence, retains the label/body relationship, and produces no horizontal overflow.
- Accessibility: semantic headings, articles, and a definition list preserve document structure; labels do not depend on color alone.

## Primary checks

- Desktop rendering inspected at 1440 × 1000.
- Mobile rendering inspected at 390 × 844.
- Eight feature statements and 25 technical specifications confirmed in the browser.
- Browser console checked with no errors or warnings attributable to the section.
- Sanity schema deployed and the current `homePage.volume` document populated.

## Comparison history

The initial implementation capture was taken before the section entered the viewport, so its one-time reveal state obscured the content. The section was then scrolled into view and recaptured after the progressive motion layer completed. The normalized side-by-side comparison confirms the intended structural match.

## Follow-up polish

- P3: The supplied content makes the completed section taller than the reference. This is an intentional information-density difference rather than a layout defect; content can be shortened or reordered directly in Sanity later.

final result: passed

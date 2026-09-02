# Floor-plan exploded view — design QA

## Evidence

- Source sketch: `/var/folders/55/58r0fmnj6yx3cxl1s2ws5s6m0000gn/T/codex-clipboard-a4b18c5c-4004-4ceb-85d2-fe2b3f89851e.png`
- Implementation capture: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/floor-plans-implementation-final.png`
- Side-by-side comparison: `/Users/anton/Documents/GitHub/fokusnordic-cms-final/floor-plans-comparison.png`
- Implementation viewport: 1280 × 900 CSS pixels
- Reference normalized to: 1280 × 653 from the 4096 × 2090 source
- State: Ground floor, Configuration 01

The entire floor-plan section is the focused component, so the full-section capture also serves as the focused comparison.

## Review

- Layout: the floor tabs remain above the plan, the configuration-specific exploded view replaces the former floor heading in the left column, the configuration navigation remains below it, and the main floor plan retains the dominant right-hand field.
- Typography: existing site type tokens and Tailwind utilities are preserved; no screenshot-specific text scale was introduced.
- Spacing and color: all new dimensions, ratios, and colors resolve through existing CSS custom-property tokens.
- Imagery: both views use independent Sanity image fields. The exploded image is rendered as a transparent `next/image` asset and changes with the selected configuration. Missing assets receive an editor-facing fallback rather than a fabricated image.
- Copy: the visible floor-name heading was removed as requested. Existing configuration titles and labels remain CMS-driven.

## Interaction and responsive checks

- Switching configurations changes both `planImage` and `explodedImage` from the same configuration object.
- Switching to a configuration without an exploded asset shows the fallback; switching back restores the corresponding image.
- At 390 × 844, the exploded view stacks above the main plan without horizontal overflow.
- Desktop and mobile checks reported no console errors or warnings.
- The page query already fetches `explodedImage` per configuration; the deployed schema now labels this field explicitly as “Exploded view for this configuration”.

## Iteration history

The first production-style capture exposed stale CMS data from the cached build and Sanity CDN. The client now relies on Next revalidation against Sanity's API, the build cache was regenerated, and the final capture confirms the current floor and configuration data.

## Result

Passed for the requested state and responsive behavior.

# Barnängshuset — CMS-Driven Component Architecture

## Project Vision

**One-pager website** for Barnängshuset (Stockholm creative office building) using a **modular, reorderable component system** that doubles as a **CMS specification**. Every page section is a component; every component is configured via JSON. The goal is to show how content, design, and behavior live together in a portable, iterable system.

---

## Design System Constraints

### Visual Direction
- **Serif-led typography**: Petit Serif for headlines, elegant serif for body
- **Cream baseline**: Off-white backgrounds, minimal aesthetic
- **Dark cinematic imagery**: Deploy strategically to add emotional weight; does not define the layout
- **Pattern system**: Subtle geometric accent (appears as background watermark or divider)
- **Color palette**: Dark navy (#1a1a1a), dark green (#2D5A3D), cream (#F5F3ED)

### Layout Philosophy
- **Content-driven**: Imagery supports text, not the reverse
- **Breathing room**: Generous whitespace, justified text, serif elegance
- **Information hierarchy**: When clarity is needed, image recedes; when emotion is needed, image takes foreground

---

## Design Handoff Files — How to Use Them

When a design handoff (from Claude Design or any other source) is provided, it will likely include exact pixel values, specific margin/padding numbers, hard-coded hex colors, explicit motion curves, and raw CSS. **Do not implement those specs literally.** Treat the handoff as a brief, not a blueprint.

### The rule
> Use the design intent from the handoff, but always build with the project's own component system.

Concretely:

| Handoff says | What to do instead |
|---|---|
| `padding: 80px 32px` | Map to the nearest `paddingY` / `paddingX` token on `Section` |
| `max-width: 1280px; margin: 0 auto` | Use `maxWidth="xl"` on `Section` — never hardcode |
| `background-image: url(...)` | Use `bgImage` prop on `Section` or `VisualSurface` |
| `background: rgba(0,0,0,0.4)` | Use `overlay="dark"` — never inline style |
| `display: grid; grid-template-columns: repeat(3, 1fr)` | Use `grid cols={3}` on `Section` |
| Raw `<div class="max-w-7xl mx-auto px-8">` | Use `Section` — never write this div by hand |
| Specific easing like `cubic-bezier(0.16,1,0.3,1)` | Map to the named variant in `src/lib/motion.ts` (`expo`, `slowTransition`, etc.) |
| New color not in the palette | Flag it, then use the closest token from `src/tokens/design-tokens.ts` |

### What the handoff IS useful for
- Visual hierarchy and spacing **relationships** (what's bigger, what breathes more)
- Which overlay density to use (`dark`, `dark_strong`, `light`)
- Whether a section should be `paddingY="lg"` vs `"xl"` (read the rhythm, not the px)
- Confirming `maxWidth` choice (narrow prose vs. wide grid)
- Motion intent (fast/snappy vs. slow/cinematic → maps to `cardTransition` vs. `slowTransition`)
- Copy, image selections, and content structure

---

## Layout System — Read This Before Building Any Section

### Two mandatory base components — always use them

Every section on this site **must** use these two primitives from `src/components/layout/`:

#### `VisualSurface` — full-bleed backgrounds
Handles background color, image, video, and overlay. Always renders full-width.
```tsx
import { VisualSurface } from "../../layout";

<VisualSurface bgImage={{ src: "..." }} overlay="dark" minHeight="100vh">
  {/* content sits above the bg layers */}
</VisualSurface>
```

#### `Section` — constrained content container
Wraps `VisualSurface` and adds a **centered max-width container** + optional grid.
```tsx
import { Section } from "../../layout";

// Full-bleed bg, content at max-width:
<Section bgImage={{ src: "..." }} overlay="dark" paddingY="xl" maxWidth="xl">
  <h1>Content here</h1>
</Section>

// No bg, plain layout:
<Section paddingY="lg" maxWidth="lg" grid cols={3} gap="md">
  {cards}
</Section>

// asChild — user element replaces the inner <section> tag:
<Section asChild bgColor="#F5F3ED" paddingY="xl" maxWidth="xl">
  <header>...</header>
</Section>
```

### The rule: backgrounds bleed, content doesn't
- **Backgrounds** (color / image / video / overlay) → always full-width via `VisualSurface`
- **Content** (text, cards, grids) → always inside the `Section` max-width container
- **Never** wrap a section in a raw `<div>` with hardcoded `max-w-*` and `px-*` — use `Section` props instead
- **Never** use inline `style={{ backgroundImage: ... }}` for section backgrounds — use `bgImage` prop

### Token reference
```
maxWidth: "sm"=672px  "md"=896px  "lg"=1152px  "xl"=1280px  "2xl"=1536px  "full"=none
paddingX: "none" "sm"=px-4  "md"=px-4 md:px-8  "lg"=px-4 md:px-8 lg:px-16
paddingY: "none" "sm"=py-8  "md"=py-12 md:py-16  "lg"=py-16 md:py-24  "xl"=py-20 md:py-32
cols:     1 | 2 | 3 | 4 | 6 | 12  (responsive by default: 1 col on mobile)
gap:      "sm"=gap-4  "md"=gap-8  "lg"=gap-12
overlay:  "dark" | "dark_strong" | "light" | { color, opacity }
```

### Content alignment rule
All sections use `maxWidth="xl"` (`max-w-7xl`, 1280 px) as the default content width so text left-edges align vertically when scrolling. Only deviate if the design specifically calls for a narrower container (e.g. a prose-only block might use `"md"`).

---

## Component Architecture

### Core Principle: Composable Sections

A **Section** is a self-contained, reorderable block. Each section:
- Has a defined **type** (Hero, ConceptBlock, NeighborhoodGrid, etc.)
- Accepts **props** (text, images, layout options)
- Is configured via **JSON** (no hardcoding)
- Can appear anywhere, in any order, multiple times

### Section Types (Phase 1)

#### 1. **Hero**
- Full-width, dramatic entry point
- Optional: dark cinematic image with overlay
- H1 headline, supporting intro paragraph
- Primary CTA button
- Dark cinematic variant (image + white text) or cream variant (serif headline, minimal)

#### 2. **ConceptBlock**
- Two-column or full-width prose + imagery
- Serif-led copy, justified text
- Optional pull quote or emphasizing element
- Can appear with or without image

#### 3. **PropertyShowcase**
- Grid of 3-6 property/floor highlight cards
- Each card: image, title, key specs (sqm, floor, status)
- Link to detail or availability

#### 4. **NeighborhoodGrid**
- Card grid: local spots (cafés, bars, shops, nature)
- Per card: image, name, distance, category, description
- Filterable by category (optional, in config)

#### 5. **AmenitiesGrid**
- Feature cards: gym, lounge, restaurant, etc.
- Icon or image, name, description, capacity/hours if relevant

#### 6. **ContactSection**
- Simple form (viewing request, conference inquiry, general)
- Team bios/contact cards
- Address, hours, footer links

#### 7. **Pattern** (structural)
- Deployable as background accent, divider, or standalone
- Procedurally generated or static asset
- Subtle, doesn't dominate

---

## CMS Data Model

### Page Config Structure
```typescript
interface PageConfig {
  metadata: {
    title: string;
    description: string;
    lang: "sv" | "en";
  };
  sections: Section[];
}

type Section = 
  | HeroSection
  | ConceptBlockSection
  | PropertyShowcaseSection
  | NeighborhoodGridSection
  | AmenitiesGridSection
  | ContactSection;

interface BaseSection {
  id: string;
  type: string;
  order: number;
}

interface HeroSection extends BaseSection {
  type: "hero";
  variant: "dark_cinematic" | "cream_minimal";
  headline: string;
  intro: string;
  image?: { src: string; alt: string };
  cta: { label: string; href: string };
}

// ...more types follow
```

### Why JSON?
- **Transparent**: You can see exactly how content maps to components
- **Portable**: Export to Sanity/Dato/Strapi later (schema migration is trivial)
- **Iterable**: Change order, add sections, test combinations without touching code
- **Debuggable**: Compare rendered vs. configured state easily

---

## File Structure

```
src/
  ├── components/
  │   ├── sections/
  │   │   ├── Hero/               Hero.tsx
  │   │   ├── ConceptBlock/       ConceptBlock.tsx
  │   │   ├── PropertyShowcase/   PropertyShowcase.tsx
  │   │   ├── NeighborhoodGrid/   NeighborhoodGrid.tsx
  │   │   ├── AmenitiesGrid/      AmenitiesGrid.tsx
  │   │   ├── ContactSection/     ContactSection.tsx
  │   │   └── SpacesIndex/        SpacesIndex.tsx  ← INGRAO-style list+image
  │   ├── ui/
  │   │   ├── Button.tsx
  │   │   └── Card.tsx
  │   └── layout/
  │       ├── VisualSurface.tsx   ← full-bleed bg primitive (USE THIS)
  │       ├── Section.tsx         ← max-width container + grid (USE THIS)
  │       ├── index.ts            ← barrel export
  │       └── PageRenderer.tsx    ← reads config, renders sections in order
  ├── config/
  │   └── page-content.json      (the "CMS" — add new sections here)
  ├── lib/
  │   ├── motion.ts              (shared Framer Motion variants)
  │   └── utils.ts               (cn() helper — clsx + tailwind-merge)
  ├── tokens/
  │   └── design-tokens.ts       (colors, fonts, spacing)
  ├── types/
  │   └── sections.ts            (TypeScript interfaces for all section types)
  └── App.tsx
```

---

## Build Process

1. **TypeScript compilation**: Ensures section configs match schema
2. **Tailwind CSS**: Design tokens as utilities; custom CSS for serif layouts
3. **Vite dev server**: Fast iteration
4. **Static export** or **API-driven**: Both supported (JSON file or fetch from CMS API later)

---

## Adding a New Section — Checklist

1. **Create** `src/components/sections/YourSection/YourSection.tsx`
   - Import `Section` from `../../layout` — use it as the outer wrapper
   - Pass `bgColor` / `bgImage` / `bgVideo` / `overlay` for any background
   - Use `paddingY`, `maxWidth`, `grid`, `cols`, `gap` for layout
2. **Add types** to `src/types/sections.ts` — new interface + add to `Section` union
3. **Wire** in `src/components/layout/PageRenderer.tsx` — add a `case` to the switch
4. **Add content** to `src/config/page-content.json` — new section object

---

## Notes

- **No CMS UI yet**: Content is configured in JSON. If you want a CMS UI later, the schema is portable.
- **Images are placeholders**: We'll reference real Barnängshuset imagery by path; actual assets TBD.
- **Responsive behavior**: Tailwind handles breakpoints; serif layouts degrade gracefully on mobile.
- **Multilingual ready**: Page config includes `lang`; components can switch text by language key.

---

## Success Criteria

✅ One-pager loads  
✅ All section types render correctly  
✅ Sections reorder when JSON config changes  
✅ Design system (serif, colors, spacing) is consistent  
✅ Both dark cinematic and cream minimal variants work  
✅ Component architecture is clear and extends easily  


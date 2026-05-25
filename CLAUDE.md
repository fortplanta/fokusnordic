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
  │   │   ├── Hero/
  │   │   │   ├── Hero.tsx
  │   │   │   ├── Hero.module.css
  │   │   │   └── Hero.types.ts
  │   │   ├── ConceptBlock/
  │   │   ├── PropertyShowcase/
  │   │   ├── NeighborhoodGrid/
  │   │   ├── AmenitiesGrid/
  │   │   ├── ContactSection/
  │   │   └── Pattern/
  │   ├── ui/
  │   │   ├── Button.tsx
  │   │   ├── Card.tsx
  │   │   └── Link.tsx
  │   └── layout/
  │       └── PageRenderer.tsx (reads config, renders sections in order)
  ├── config/
  │   └── page-content.json (the "CMS")
  ├── tokens/
  │   └── design-tokens.ts (colors, fonts, spacing)
  ├── types/
  │   └── sections.ts (TypeScript interfaces for all section types)
  ├── App.tsx
  ├── index.css
  └── globals.css
```

---

## Build Process

1. **TypeScript compilation**: Ensures section configs match schema
2. **Tailwind CSS**: Design tokens as utilities; custom CSS for serif layouts
3. **Vite dev server**: Fast iteration
4. **Static export** or **API-driven**: Both supported (JSON file or fetch from CMS API later)

---

## Next Steps (This Session)

- [ ] Scaffold React + TypeScript + Tailwind project
- [ ] Create design tokens (colors, typography, spacing)
- [ ] Build Hero and ConceptBlock components (show the pattern)
- [ ] Build PropertyShowcase, NeighborhoodGrid components
- [ ] Create page config (JSON) with sample content
- [ ] Wire PageRenderer to compose and order sections
- [ ] Test reordering by changing JSON config
- [ ] Deploy/render one-pager

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


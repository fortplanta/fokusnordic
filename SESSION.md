# SESSION.md — Build Barnängshuset One-Pager & CMS Architecture

**Goal**: Scaffold a React + TypeScript + Tailwind project with modular, reorderable sections. By end of session: working one-pager with Hero, ConceptBlock, PropertyShowcase, NeighborhoodGrid, AmenitiesGrid, and Contact sections. All configured via JSON.

**Deliverables**:
1. Working `npm run dev` environment
2. Design tokens (colors, fonts, spacing)
3. Hero and ConceptBlock sections (two variants each)
4. PropertyShowcase, NeighborhoodGrid, AmenitiesGrid sections
5. ContactSection with form stub
6. Page config (JSON) with sample Barnängshuset content
7. PageRenderer component that reads JSON and outputs sections in order
8. One-pager renders cleanly (all sections, proper spacing, design system applied)

**Non-Goals**:
- CMS UI (that's later)
- Backend API integration (JSON file is the source of truth for now)
- Animation/interaction design (structure first, motion second)
- Full accessibility audit (but semantic HTML from the start)

**Tech Stack**:
- React 18 + TypeScript
- Vite (dev server + build)
- Tailwind CSS (design tokens + utilities)
- Custom CSS modules for serif layouts (Petit Serif, font hierarchies)

**File checklist**:
- [ ] `package.json` + `vite.config.ts`
- [ ] `src/tokens/design-tokens.ts`
- [ ] `src/types/sections.ts` (TypeScript interfaces)
- [ ] `src/components/sections/Hero/Hero.tsx` + variants
- [ ] `src/components/sections/ConceptBlock/ConceptBlock.tsx`
- [ ] `src/components/sections/PropertyShowcase/PropertyShowcase.tsx`
- [ ] `src/components/sections/NeighborhoodGrid/NeighborhoodGrid.tsx`
- [ ] `src/components/sections/AmenitiesGrid/AmenitiesGrid.tsx`
- [ ] `src/components/sections/ContactSection/ContactSection.tsx`
- [ ] `src/components/ui/Button.tsx`, `Card.tsx`, `Link.tsx`
- [ ] `src/components/layout/PageRenderer.tsx`
- [ ] `src/config/page-content.json`
- [ ] `src/App.tsx`
- [ ] `src/index.css` + Tailwind setup
- [ ] `.gitignore`, `tsconfig.json`

**How to iterate**:
1. After scaffold, spin up `npm run dev`
2. Edit `page-content.json` to reorder/add sections (no code changes needed)
3. Build components one at a time
4. Test visual hierarchy and design consistency as you go
5. Push to git after each stable section

**Key decisions made**:
- JSON config as "CMS" (transparent, portable, no black boxes)
- Component-per-folder structure (scales well, easier to maintain)
- TypeScript for type safety on props (prevents config -> component mismatches)
- Tailwind + custom CSS modules (Tailwind for utilities, modules for serif typography rules)
- No framework dependencies beyond React (keep it portable)

**Open questions** (resolve if they block):
- Images: placeholder paths or actual URLs?
- Contact form: real submission endpoint, or just a stub?
- Neighborhood/Amenities: sample data count? (3 items each, or more?)

---

## How This Looks When Done

```
$ npm run dev
> vite dev

  Local:   http://localhost:5173
  
✓ One-pager loads
✓ Hero section at top (cream variant with serif headline)
✓ ConceptBlock section (dark cinematic image on right, text on left)
✓ PropertyShowcase (3 cards, each with image + specs)
✓ NeighborhoodGrid (6 local spot cards)
✓ AmenitiesGrid (4-5 amenity cards)
✓ ContactSection (form + team bios)
✓ Design system consistent throughout (serif fonts, cream backgrounds, dark green accents)
✓ Edit page-content.json, save → page re-renders with new section order

Ready for:
- Visual refinement (fine-tune spacing, typography, imagery)
- Content iteration (add/remove sections, change text)
- CMS integration (swap JSON for API call)
- Deployment
```


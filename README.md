# Barnängshuset One-Pager & CMS Architecture

A modular, reorderable component-based website for Barnängshuset (Stockholm creative office building). All page sections are configured via JSON, making them instantly reorderable without code changes.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The site will open at `http://localhost:5173`

---

## Project Structure

```
src/
├── components/
│   ├── sections/          # Page section components (Hero, ConceptBlock, etc)
│   │   ├── Hero/
│   │   ├── ConceptBlock/
│   │   ├── PropertyShowcase/
│   │   ├── NeighborhoodGrid/
│   │   ├── AmenitiesGrid/
│   │   └── ContactSection/
│   ├── ui/                # Reusable UI primitives (Button, Card, etc)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Link.tsx
│   └── layout/
│       └── PageRenderer.tsx  # Renders sections in order from config
├── config/
│   └── page-content.json  # THE CMS (page sections, content, data)
├── types/
│   └── sections.ts        # TypeScript interfaces for all section types
├── tokens/
│   └── design-tokens.ts   # Design system (colors, typography, spacing)
├── App.tsx
└── index.css
```

---

## How It Works

### 1. **Config-Driven Rendering**

All content lives in `src/config/page-content.json`. The `PageRenderer` component reads this config and renders sections in order:

```json
{
  "metadata": { "title": "...", "lang": "en" },
  "sections": [
    { "id": "hero", "type": "hero", "variant": "dark_cinematic", "headline": "..." },
    { "id": "concept", "type": "concept", "headline": "...", "body": "..." },
    ...
  ]
}
```

### 2. **TypeScript Type Safety**

Every section type has a corresponding TypeScript interface (`HeroSection`, `ConceptBlockSection`, etc.). The config is automatically validated.

### 3. **Reordering is Instant**

Change the order of sections in `page-content.json`, save, and the page re-renders. No code changes needed.

---

## Component Architecture

### Section Types

| Type | Purpose | Fields |
|------|---------|--------|
| **hero** | Entry-point section | variant, headline, intro, image, cta |
| **concept** | Editorial content block | headline, body, image, pullQuote, imagePosition |
| **property_showcase** | Office units grid | headline, intro, properties[] |
| **neighborhood** | Local spots grid | headline, intro, spots[], enableFilters |
| **amenities** | Building amenities | headline, intro, amenities[] |
| **contact** | Contact form + team | headline, formFields[], teamMembers[], address, email, phone |

### Adding a New Section

1. **Define the type** in `src/types/sections.ts`
2. **Create the component** in `src/components/sections/YourSection/`
3. **Add to PageRenderer** switch statement
4. **Add entries to `page-content.json`** with the new section type
5. Done! No build needed.

---

## Design Tokens

Colors, typography, and spacing are centralized in `src/tokens/design-tokens.ts`. Update them once, they cascade everywhere:

```typescript
export const colors = {
  navy: { 900: "#1a1a1a" },
  cream: { 50: "#F5F3ED" },
  green: { dark: "#2D5A3D" },
};

export const typography = {
  h1: { fontSize: "56px", fontFamily: "'Petit Serif'" },
  body: { fontSize: "16px", lineHeight: "1.7" },
};
```

---

## Styling Approach

- **Tailwind CSS** for utilities and component styles
- **Custom CSS modules** for serif typography and complex layouts (in component folders)
- **CSS variables** in `src/index.css` for global fallbacks

---

## Making Changes

### Edit Content (No Code)
→ Update `src/config/page-content.json`

### Edit Design
→ Update `src/tokens/design-tokens.ts` or component CSS

### Add a Section
→ Create component, add type, register in PageRenderer

### Change Section Order
→ Adjust `order` field in config JSON

---

## Extending for a Real CMS

When you're ready to connect a real CMS (Sanity, Dato, Strapi):

1. Replace the JSON import in `src/App.tsx` with a fetch call:
   ```typescript
   const pageConfig = await fetch('https://cms.api.com/page').then(r => r.json());
   ```

2. The rest of the code stays **exactly the same**. The schema is already portable.

---

## Next Steps

- [ ] Connect to real CMS
- [ ] Add animations/transitions
- [ ] Optimize images
- [ ] Set up analytics
- [ ] Deploy (Vercel, Netlify, etc)

---

## Notes

- Images in config use placeholder URLs from Unsplash. Replace with real Barnängshuset assets.
- The contact form is a stub. Connect to a backend endpoint when ready.
- All sections support both Swedish and English (set `lang` in metadata).

---

**Built with React + TypeScript + Tailwind + Vite**

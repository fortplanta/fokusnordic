# Component API Reference & Iteration Guide

Quick lookup for all section types, their props, and how to modify them.

---

## Hero Section

### Type: `hero`

```json
{
  "id": "hero-id",
  "type": "hero",
  "order": 1,
  "variant": "dark_cinematic" | "cream_minimal",
  "headline": "Main heading",
  "intro": "Optional supporting text",
  "image": {
    "src": "url-to-image",
    "alt": "Alt text"
  },
  "cta": {
    "label": "Button text",
    "href": "#target",
    "variant": "primary" | "secondary" | "tertiary"
  }
}
```

### Usage
- **Dark cinematic**: For emotional impact, hero images with overlay
- **Cream minimal**: For content-first, text-heavy entry

### Customize
- Edit `src/components/sections/Hero/Hero.tsx` for layout
- Edit `src/tokens/design-tokens.ts` for colors/typography
- Edit JSON config to change text/image/CTA

---

## ConceptBlock Section

### Type: `concept`

```json
{
  "id": "concept-id",
  "type": "concept",
  "order": 2,
  "headline": "Optional headline",
  "body": "Main body text (supports long-form prose)",
  "image": {
    "src": "url-to-image",
    "alt": "Alt text",
    "caption": "Optional image caption"
  },
  "imagePosition": "left" | "right",
  "pullQuote": "Optional pull quote / emphasis"
}
```

### Usage
- Editorial content with supporting imagery
- Two-column layout (text left/image right, or vice versa)
- Good for storytelling, positioning, detailed explanations

### Customize
- Change `imagePosition` to flip layout
- Add/remove `pullQuote` for emphasis
- Adjust column ratios in `ConceptBlock.tsx`

---

## PropertyShowcase Section

### Type: `property_showcase`

```json
{
  "id": "property-id",
  "type": "property_showcase",
  "order": 3,
  "headline": "Optional section headline",
  "intro": "Optional intro text",
  "properties": [
    {
      "id": "unit-1",
      "name": "Floor 2 North",
      "floor": "2",
      "sqm": 450,
      "status": "available" | "reserved" | "leased",
      "image": { "src": "...", "alt": "..." },
      "details": "Description of the space",
      "ctaLabel": "View Details"
    }
  ]
}
```

### Usage
- Showcase office units, floors, or available spaces
- Cards with image, specs, status badge
- CTA leads to detail page or contact form

### Customize
- Add/remove properties from array
- Change status to update badge color
- Edit `PropertyShowcase.tsx` for card layout

---

## NeighborhoodGrid Section

### Type: `neighborhood`

```json
{
  "id": "neighborhood-id",
  "type": "neighborhood",
  "order": 4,
  "headline": "Optional headline",
  "intro": "Optional intro text",
  "enableFilters": true | false,
  "spots": [
    {
      "id": "spot-1",
      "name": "Café SoFo",
      "category": "cafe" | "bar" | "restaurant" | "shop" | "nature" | "culture",
      "distance": "5 min walk",
      "time": "10 min bike",
      "description": "Short description",
      "image": { "src": "...", "alt": "..." },
      "link": "https://external-link.com",
      "tags": ["morning", "coffee", "work-friendly"]
    }
  ]
}
```

### Usage
- Showcase local spots and neighborhood character
- Cards with image, category, distance, description
- Optional category filters (café, bar, nature, etc)

### Customize
- Add/remove spots from array
- Set `enableFilters: true` to show category buttons
- Update category if you need different ones

---

## AmenitiesGrid Section

### Type: `amenities`

```json
{
  "id": "amenities-id",
  "type": "amenities",
  "order": 5,
  "headline": "Optional headline",
  "intro": "Optional intro text",
  "amenities": [
    {
      "id": "gym-1",
      "name": "Studio Gym",
      "type": "gym" | "lounge" | "cafe" | "restaurant" | "conference" | "other",
      "description": "What is this amenity and what does it offer",
      "image": { "src": "...", "alt": "..." },
      "icon": "📍",
      "capacity": "30 people",
      "hours": "06:00–22:00"
    }
  ]
}
```

### Usage
- Showcase building amenities (gym, restaurant, conference rooms, etc)
- Cards with image/icon, description, capacity, hours
- Helps sell the workspace experience

### Customize
- Add/remove amenities from array
- Use emoji icons or image assets
- Edit capacity and hours for accuracy

---

## ContactSection

### Type: `contact`

```json
{
  "id": "contact-id",
  "type": "contact",
  "order": 6,
  "headline": "Optional headline",
  "intro": "Optional intro",
  "address": "Full address",
  "phone": "+46 8 555 00 123",
  "email": "info@example.com",
  "formFields": [
    {
      "name": "fieldName",
      "label": "Field Label",
      "type": "text" | "email" | "textarea" | "select",
      "required": true,
      "placeholder": "Placeholder text",
      "options": ["Option 1", "Option 2"] // For select only
    }
  ],
  "teamMembers": [
    {
      "id": "person-1",
      "name": "Full Name",
      "role": "Job Title",
      "image": { "src": "...", "alt": "..." },
      "email": "person@example.com",
      "phone": "+46 8 555 00 124"
    }
  ]
}
```

### Usage
- Contact form for inquiries
- Display contact info (address, phone, email)
- Show team members / key contacts
- Form submission (stub for now, connect to backend)

### Customize
- Add/remove form fields
- Add/remove team members
- Update contact details
- Connect form to actual endpoint in `ContactSection.tsx`

---

## Making Quick Changes

### Change Section Order
Edit the `order` field in each section in `page-content.json`. Lower numbers appear first.

### Change Colors
Edit `src/tokens/design-tokens.ts`:
```typescript
colors: {
  navy: { 900: "#1a1a1a" },  // ← Change here
  cream: { 50: "#f5f3ed" },
}
```

### Change Typography
Edit font names and sizes in `src/tokens/design-tokens.ts`:
```typescript
typography: {
  h1: { fontSize: "56px", fontFamily: "'Petit Serif'" },  // ← Change here
}
```

### Add a New Amenity
Add to the `amenities` array in `page-content.json`:
```json
{
  "id": "yoga-1",
  "name": "Yoga Studio",
  "type": "lounge",
  "description": "Daily yoga and meditation classes",
  "hours": "07:00–19:00"
}
```

### Remove a Section
Delete the entire section object from `sections` array in `page-content.json`. The page re-renders instantly.

### Replace Images
Update `src` URLs in any `image` object:
```json
"image": {
  "src": "https://new-image-url.com/photo.jpg",
  "alt": "Updated alt text"
}
```

---

## Debugging

### Section not rendering?
- Check the `type` field matches a known section type
- Check `id` is unique
- Check JSON syntax (extra commas, missing quotes)
- Open browser console for error messages

### Styling looks off?
- Check `src/tokens/design-tokens.ts` for color/font values
- Check component CSS in `src/components/sections/YourSection/`
- Check Tailwind utilities are correct

### Form not working?
- Check form field `name` matches what you expect
- Open browser dev tools → Network tab to see form submission
- Edit `ContactSection.tsx` to wire up real endpoint

---

## Adding Custom CSS

Each section component can have a `.module.css` file:

```
src/components/sections/Hero/
  ├── Hero.tsx
  └── Hero.module.css  ← Optional for custom styles
```

```css
/* Hero.module.css */
.heroOverlay {
  background: linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3));
}

.heroText {
  font-family: 'Petit Serif', serif;
  line-height: 1.2;
}
```

Then import in component:
```typescript
import styles from './Hero.module.css';

<div className={styles.heroOverlay}>...</div>
```

---

## Performance Tips

- **Use web fonts sparingly**: Petit Serif is nice, but load it conditionally
- **Optimize images**: Compress before uploading, use appropriate formats (WebP)
- **Lazy load images**: Add `loading="lazy"` to `<img>` tags for below-fold content
- **Keep JSON config lean**: Don't store huge strings; reference external content

---

## Questions?

Refer to:
- `CLAUDE.md` for architecture overview
- `SESSION.md` for project goals
- Component files in `src/components/sections/` for implementation details
- `src/types/sections.ts` for TypeScript type definitions

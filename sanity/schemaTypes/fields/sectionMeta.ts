import { defineField } from 'sanity'

/**
 * Shared editorial-control fields, added to every section block type.
 *
 * headingLevelField — semantic tag only; visual size stays on the CSS type
 * scale so heading levels can't be used as a "make it bigger" lever.
 *
 * colorThemeField — a PALETTE SELECTOR, not a color picker. Background and
 * text are paired per theme to guarantee contrast and brand consistency;
 * editors can never set them independently. The constraint is the feature.
 */

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

export const headingLevelField = (initialValue: HeadingLevel = 'h2') =>
  defineField({
    name: 'headingLevel',
    title: 'Heading level',
    type: 'string',
    description:
      'Controls the HTML heading level for SEO and accessibility. Visual size is unchanged. The page should have exactly one h1.',
    options: {
      list: [
        { title: 'h1', value: 'h1' },
        { title: 'h2', value: 'h2' },
        { title: 'h3', value: 'h3' },
        { title: 'h4', value: 'h4' },
      ],
      layout: 'dropdown',
    },
    initialValue,
  })

export type ColorTheme = 'light' | 'warm' | 'dark' | 'brand' | 'deep' | 'neutral'

export const colorThemeField = (initialValue: ColorTheme = 'light') =>
  defineField({
    name: 'colorTheme',
    title: 'Color theme',
    type: 'string',
    description:
      'Sets the section’s background and text color. Choose a theme — background and text are paired to ensure contrast and brand consistency.',
    options: {
      list: [
        { title: 'Light — Blekäng / Beck',  value: 'light' },
        { title: 'Warm — Ängsull / Beck',   value: 'warm' },
        { title: 'Dark — Beck / Blekäng',   value: 'dark' },
        { title: 'Brand — Reseda / Blekäng', value: 'brand' },
        { title: 'Deep — Mylla / Blekäng',  value: 'deep' },
        { title: 'Neutral — Aska / Beck',   value: 'neutral' },
      ],
      layout: 'dropdown',
    },
    initialValue,
  })

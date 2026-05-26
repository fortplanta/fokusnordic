/**
 * Design Tokens for Barnängshuset
 *
 * Centralized design system values that feed both CSS and component logic.
 * The source of truth for color, typography, and spacing.
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Deep / near-black — warm late-evening lobby
  deep: "#13100D",

  // Neutral dark scale
  navy: {
    900: "#1a1a1a",
    800: "#2d2d2d",
    700: "#3d3d3d",
  },

  // Cream / parchment scale
  cream: {
    50:  "#F6F2EA",  // Main background — warm parchment
    100: "#FAF7F2",  // Lighter warm white
    200: "#EDE7DA",  // Dividers, subtle contrast
  },

  // Stone / putty — material neutral
  stone: {
    200: "#DDD8D0",
    300: "#C4BAB0",
    400: "#A89B8C",
  },

  // Forest green
  green: {
    dark:  "#274E36",  // Primary CTA, links, accents
    mid:   "#336348",  // Hover state
    light: "#E4EDE6",  // Tinted background
  },

  // Terracotta — warm textile accent
  terra: {
    DEFAULT: "#A05C3B",
    light:   "#F0E6DF",
  },

  // Text semantic
  text: {
    primary:   "#13100D",
    secondary: "#5C544A",
    muted:     "#9E9087",
    inverse:   "#FAF7F2",
  },

  // Borders
  border: {
    light: "#E4DDD4",
    mid:   "#C4BAB0",
    dark:  "#2d2d2d",
  },

  // Functional
  error:   "#C0392B",
  success: "#274E36",
  warning: "#A05C3B",
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    serif:    `'Petit Serif', 'Georgia', serif`,
    sans:     `'Mona Sans', system-ui, -apple-system, sans-serif`,
    body:     `'Mona Sans', system-ui, sans-serif`,
    sansCond: `'Mona Sans Condensed', 'Mona Sans', system-ui, sans-serif`,
    sansSemi: `'Mona Sans SemiCondensed', 'Mona Sans', system-ui, sans-serif`,
  },

  // Display — Petit Serif
  display: {
    xl: { fontSize: "72px", lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: 400 },
    lg: { fontSize: "56px", lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: 400 },
    md: { fontSize: "42px", lineHeight: "1.4", letterSpacing: "-0.02em", fontWeight: 400 },
    sm: { fontSize: "32px", lineHeight: "1.4", fontWeight: 400 },
    xs: { fontSize: "24px", lineHeight: "1.4", fontWeight: 400 },
  },

  // Body — Mona Sans
  body: {
    lg: { fontSize: "20px", lineHeight: "1.7", letterSpacing: "-0.015em" },
    md: { fontSize: "16px", lineHeight: "1.7", letterSpacing: "-0.015em" },
    sm: { fontSize: "14px", lineHeight: "1.7", letterSpacing: "-0.015em" },
    xs: { fontSize: "12px", lineHeight: "1.4" },
  },

  label: {
    fontSize: "12px",
    lineHeight: "1.4",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  1:  "4px",
  2:  "8px",
  3:  "12px",
  4:  "16px",
  5:  "20px",
  6:  "24px",
  8:  "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  32: "128px",

  // Section rhythm
  section:        "96px",
  sectionCompact: "64px",
  gutter:         "64px",
  gutterSm:       "24px",
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  mobile:  "640px",
  tablet:  "1024px",
  desktop: "1280px",
} as const;

// ============================================================================
// MOTION
// ============================================================================

export const motion = {
  duration: {
    micro:  150,  // ms — hover shifts
    base:   300,  // ms — standard UI
    reveal: 500,  // ms — content entering viewport
    slow:   800,  // ms — hero, cinematic
  },
  easing: {
    glide:    [0.25, 0.10, 0.25, 1.00] as const, // smooth, ends soft
    enter:    [0.00, 0.00, 0.20, 1.00] as const, // decelerate — arriving
    exit:     [0.40, 0.00, 1.00, 1.00] as const, // accelerate — leaving
    editorial:[0.16, 1.00, 0.30, 1.00] as const, // hero type — elegant overshoot
  },
  reveal: {
    offsetY:  16,  // px
    offsetX:  24,  // px
    opacity:  0,
    stagger:  80,  // ms between children
  },
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: "none",
  xs:   "0 1px 2px rgba(0,0,0,0.05)",
  sm:   "0 2px 4px rgba(0,0,0,0.08)",
  md:   "0 4px 12px rgba(0,0,0,0.10)",
  lg:   "0 10px 24px rgba(0,0,0,0.14)",
  xl:   "0 20px 40px rgba(0,0,0,0.18)",
} as const;

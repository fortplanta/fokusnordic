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
  // Neutrals
  navy: {
    900: "#1a1a1a", // Primary text, backgrounds
    800: "#2d2d2d", // Secondary elements
  },
  cream: {
    50: "#F5F3ED",  // Paper-like background
    100: "#FAF8F4", // Lighter variant
  },
  
  // Accents
  green: {
    dark: "#2D5A3D", // CTA, highlights
  },
  
  // Functional
  text: {
    primary: "#1a1a1a",    // Body text
    secondary: "#5a5a5a",  // Muted text
    inverse: "#FFFFFF",    // Text on dark backgrounds
  },
  border: {
    light: "#E5E5E5",
    dark: "#2d2d2d",
  },
  error: "#D63031",
  success: "#27AE60",
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    serif: `'Petit Serif', 'Georgia', serif`,
    sans: `'Mona Sans', system-ui, -apple-system, sans-serif`,
  },
  
  // Serif headings & body
  h1: {
    fontSize: "56px",
    lineHeight: "1.2",
    fontFamily: "'Petit Serif', serif",
    fontWeight: 400,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontSize: "42px",
    lineHeight: "1.3",
    fontFamily: "'Petit Serif', serif",
    fontWeight: 400,
    letterSpacing: "-0.02em",
  },
  h3: {
    fontSize: "32px",
    lineHeight: "1.4",
    fontFamily: "'Petit Serif', serif",
    fontWeight: 400,
  },
  
  body: {
    fontSize: "16px",
    lineHeight: "1.7",
    fontFamily: "'Petit Serif', serif",
    fontWeight: 400,
  },
  
  bodySmall: {
    fontSize: "14px",
    lineHeight: "1.6",
    fontFamily: "'Petit Serif', serif",
    fontWeight: 400,
  },
  
  label: {
    fontSize: "12px",
    lineHeight: "1.5",
    fontFamily: "'Mona Sans', sans-serif",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  
  button: {
    fontSize: "14px",
    lineHeight: "1.5",
    fontFamily: "'Mona Sans', sans-serif",
    fontWeight: 500,
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",
  
  // Section spacing (vertical rhythm)
  gutter: "4rem",     // Page horizontal padding
  section: "6rem",    // Space between sections
  sectionCompact: "4rem",
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  mobile: "640px",
  tablet: "1024px",
  desktop: "1280px",
} as const;

// ============================================================================
// SHADOWS & EFFECTS
// ============================================================================

export const effects = {
  shadow: {
    none: "none",
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.2)",
  },
  
  overlay: {
    dark: "rgba(0, 0, 0, 0.4)",
    darkStrong: "rgba(0, 0, 0, 0.6)",
    light: "rgba(0, 0, 0, 0.1)",
  },
} as const;

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

export const variants = {
  // Button states
  button: {
    primary: {
      bg: colors.green.dark,
      color: colors.text.inverse,
      hover: "opacity-90",
    },
    secondary: {
      bg: colors.navy[900],
      color: colors.text.inverse,
      hover: "opacity-90",
    },
    tertiary: {
      bg: "transparent",
      color: colors.navy[900],
      border: colors.navy[900],
      hover: "bg-cream-50",
    },
  },
  
  // Card backgrounds
  card: {
    light: colors.cream[50],
    dark: colors.navy[900],
  },
} as const;

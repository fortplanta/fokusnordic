/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        // Single source of truth for the page content container width.
        // Used by Section.tsx, Nav, Hero labels, SpacesIndex — change here, done everywhere.
        "content": "1920px",
      },
      colors: {
        // Deep / near-black
        deep: "#13100D",

        // Neutrals
        navy: {
          900: "#1a1a1a",
          800: "#2d2d2d",
          700: "#3d3d3d",
        },

        // Cream / parchment
        cream: {
          50:  "#F6F2EA",
          100: "#FAF7F2",
          200: "#EDE7DA",
        },

        // Stone / putty
        stone: {
          200: "#DDD8D0",
          300: "#C4BAB0",
          400: "#A89B8C",
        },

        // Forest green
        green: {
          dark:  "#274E36",
          mid:   "#336348",
          light: "#E4EDE6",
        },

        // Terracotta
        terra: {
          DEFAULT: "#A05C3B",
          light:   "#F0E6DF",
        },

        // Text semantic aliases
        text: {
          primary:   "#13100D",
          secondary: "#5C544A",
          muted:     "#9E9087",
          inverse:   "#FAF7F2",
        },

        // Border aliases
        border: {
          light: "#E4DDD4",
          mid:   "#C4BAB0",
          dark:  "#2d2d2d",
        },
      },

      fontFamily: {
        serif:     ["'Petit Serif'", "'Georgia'", "serif"],
        sans:      ["'Mona Sans'", "system-ui", "sans-serif"],
        body:      ["'Mona Sans'", "system-ui", "sans-serif"],
        condensed: ["'Mona Sans Condensed'", "'Mona Sans'", "system-ui", "sans-serif"],
        semi:      ["'Mona Sans SemiCondensed'", "'Mona Sans'", "system-ui", "sans-serif"],
      },

      fontSize: {
        // Display — Petit Serif
        "display-xl": ["72px", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "display-lg": ["56px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-md": ["42px", { lineHeight: "1.4", letterSpacing: "-0.02em" }],
        "display-sm": ["32px", { lineHeight: "1.4" }],
        "display-xs": ["24px", { lineHeight: "1.4" }],

        // Body — Mona Sans
        "body-lg": ["20px", { lineHeight: "1.7", letterSpacing: "-0.015em" }],
        "body-md": ["16px", { lineHeight: "1.7", letterSpacing: "-0.015em" }],
        "body-sm": ["14px", { lineHeight: "1.7", letterSpacing: "-0.015em" }],
        "body-xs": ["12px", { lineHeight: "1.4" }],

        // Backwards-compat aliases (keep old names working)
        "xs-serif":   ["12px", { lineHeight: "1.5" }],
        "sm-serif":   ["14px", { lineHeight: "1.6" }],
        "base-serif": ["16px", { lineHeight: "1.7" }],
        "lg-serif":   ["20px", { lineHeight: "1.6" }],
        "xl-serif":   ["24px", { lineHeight: "1.5" }],
        "2xl-serif":  ["32px", { lineHeight: "1.4" }],
        "3xl-serif":  ["42px", { lineHeight: "1.3" }],
        "4xl-serif":  ["56px", { lineHeight: "1.2" }],
      },

      letterSpacing: {
        tightest: "-0.03em",
        tight:    "-0.02em",
        snug:     "-0.015em",
        normal:   "0",
        wide:     "0.04em",
        wider:    "0.08em",
        widest:   "0.12em",
      },

      spacing: {
        "section":         "96px",
        "section-compact": "64px",
        "gutter":          "64px",
        "gutter-sm":       "24px",
      },

      gap: {
        "xl":  "72px",
        "2xl": "96px",
      },

      // Motion / transition
      transitionTimingFunction: {
        glide:    "cubic-bezier(0.25, 0.10, 0.25, 1.00)",
        enter:    "cubic-bezier(0.00, 0.00, 0.20, 1.00)",
        exit:     "cubic-bezier(0.40, 0.00, 1.00, 1.00)",
        editorial:"cubic-bezier(0.16, 1.00, 0.30, 1.00)",
      },

      transitionDuration: {
        micro:  "150ms",
        reveal: "500ms",
        slow:   "800ms",
      },

      backgroundImage: {
        "twill": "url('/assets/twillbrick-pattern.svg')",
      },
    },
  },
  plugins: [],
}

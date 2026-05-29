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
        // All colors reference CSS custom properties so that overrides set via
        // the /styleguide design panel propagate instantly to every Tailwind
        // utility class across the site (bg-*, text-*, border-*, etc.).

        deep: "var(--color-deep)",

        navy: {
          900: "var(--color-navy-900)",
          800: "var(--color-navy-800)",
          700: "var(--color-navy-700)",
        },

        cream: {
          50:  "var(--color-cream-50)",
          100: "var(--color-cream-100)",
          200: "var(--color-cream-200)",
        },

        stone: {
          200: "var(--color-stone-200)",
          300: "var(--color-stone-300)",
          400: "var(--color-stone-400)",
        },

        green: {
          dark:  "var(--color-green-dark)",
          mid:   "var(--color-green-mid)",
          light: "var(--color-green-light)",
        },

        terra: {
          DEFAULT: "var(--color-terra)",
          light:   "var(--color-terra-light)",
        },

        text: {
          primary:   "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted:     "var(--color-text-muted)",
          inverse:   "var(--color-text-inverse)",
        },

        border: {
          light: "var(--color-border-light)",
          mid:   "var(--color-border-mid)",
          dark:  "var(--color-border-dark)",
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

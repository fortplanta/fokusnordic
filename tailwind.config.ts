/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Barnängshuset palette
        navy: {
          900: "#1a1a1a",
          800: "#2d2d2d",
        },
        green: {
          dark: "#2D5A3D",
        },
        cream: {
          50: "#F5F3ED",
          100: "#FAF8F4",
        },
        text: {
          primary: "#1a1a1a",
          secondary: "#5a5a5a",
        },
      },
      fontFamily: {
        // Serif for headings and body
        serif: ["Petit Serif", "'Georgia'", "serif"],
        // Sans for UI
        sans: ["'Mona Sans'", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Serif hierarchy
        "xs-serif": ["12px", { lineHeight: "1.5", fontFamily: "var(--font-serif)" }],
        "sm-serif": ["14px", { lineHeight: "1.6", fontFamily: "var(--font-serif)" }],
        "base-serif": ["16px", { lineHeight: "1.7", fontFamily: "var(--font-serif)" }],
        "lg-serif": ["20px", { lineHeight: "1.6", fontFamily: "var(--font-serif)" }],
        "xl-serif": ["24px", { lineHeight: "1.5", fontFamily: "var(--font-serif)" }],
        "2xl-serif": ["32px", { lineHeight: "1.4", fontFamily: "var(--font-serif)" }],
        "3xl-serif": ["42px", { lineHeight: "1.3", fontFamily: "var(--font-serif)" }],
        "4xl-serif": ["56px", { lineHeight: "1.2", fontFamily: "var(--font-serif)" }],
      },
      spacing: {
        // Generous whitespace
        "gutter": "4rem",
        "section": "6rem",
      },
      letterSpacing: {
        tight: "-0.02em",
        wide: "0.05em",
      },
    },
  },
  plugins: [],
}

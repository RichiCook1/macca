import type { Config } from "tailwindcss";

/**
 * MACCA design tokens.
 * Base stays quiet (stone / ink / white space); accents are used structurally.
 * Palette derived from the master brief: Stone, Ink, Cypress, Terracotta,
 * Sky haze, Sun, Night.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stone — warm limestone / off-white backgrounds
        stone: {
          DEFAULT: "#f0ece2",
          50: "#faf8f3",
          100: "#f3efe6",
          200: "#e8e2d4",
          300: "#dbd3c0",
        },
        paper: "#f6f4ee",
        // Ink — near-black charcoal text & map linework.
        // 60/40 tuned to pass WCAG AA (≥4.5:1) on paper, stone and terracotta-tint,
        // since both are used for small meaningful text (fallback notes, metadata).
        ink: {
          DEFAULT: "#34322d",
          80: "#56524a",
          60: "#615e54",
          40: "#6f6b5f",
        },
        // Cypress — deep muted green, institutional / map / free-access
        cypress: {
          DEFAULT: "#4a5d4e",
          dark: "#3a4a3e",
        },
        // Terracotta — mineral red-orange, key CTA / selected / signal
        terracotta: {
          DEFAULT: "#c0573a",
          dark: "#a8492e",
          tint: "#fbf2ee",
        },
        // Sky haze — secondary surfaces / water / distance
        sky: {
          DEFAULT: "#c2d0d3",
          surface: "#dbe2e1",
          ink: "#5b7790",
        },
        // Sun — muted yellow-gold, alert / discovery accent only
        sun: {
          DEFAULT: "#c79a2e",
          ink: "#7a5d12",
          tint: "#fbf6e8",
        },
        // Night — deep blue-black, night-view modules & inverse surfaces
        night: {
          DEFAULT: "#283042",
          tint: "#dfe4ee",
        },
        line: "#dcd6c8",
        hairline: "#e7e1d4",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        overline: "0.16em",
      },
      borderRadius: {
        sheet: "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(52,50,45,0.08)",
        raised: "0 3px 14px rgba(52,50,45,0.10)",
        sheet: "0 -6px 24px rgba(52,50,45,0.12)",
        phone: "0 24px 60px -18px rgba(52,50,45,0.35)",
      },
      maxWidth: {
        editorial: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;

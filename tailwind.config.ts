import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      colors: {
        analog: {
          bg: "var(--analog-bg)",
          surface: "var(--analog-surface)",
          elevated: "var(--analog-elevated)",
          border: "var(--analog-border)",
          primary: "var(--analog-text-primary)",
          secondary: "var(--analog-text-secondary)",
          accent: "var(--analog-accent)",
          olive: "var(--analog-olive)",
        },
        strum: {
          down: "#65A889",
          up: "#75A9C9",
          mute: "#D69B4C",
        },
      },
      boxShadow: {
        tactile: "0 1px 2px 0 rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)",
        "tactile-pressed": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)",
        knob: "0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -2px rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
      },
      keyframes: {
        pulseBeat: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.85" },
        },
      },
      animation: {
        "pulse-beat": "pulseBeat 0.15s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;

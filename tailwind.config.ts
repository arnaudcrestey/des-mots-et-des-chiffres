import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./core/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#05070A",
        ivory: "#F6F1E8",
        gold: "#D7B56D",
        ink: "#10151C",
        panel: "#0D1218",
        panelSoft: "#111821",
        line: "rgba(246, 241, 232, 0.14)",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(215, 181, 109, 0.16)",
        softGlow: "0 0 34px rgba(215, 181, 109, 0.12)",
        panel: "0 18px 50px rgba(0, 0, 0, 0.36)",
        premium:
          "0 18px 60px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      borderRadius: {
        "2xl": "1.15rem",
        "3xl": "1.55rem",
      },
      letterSpacing: {
        premium: "0.16em",
      },
      backgroundImage: {
        "premium-panel":
          "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))",
        "gold-soft":
          "linear-gradient(135deg, rgba(215,181,109,0.22), rgba(215,181,109,0.08))",
      },
    },
  },
  plugins: [],
};

export default config;

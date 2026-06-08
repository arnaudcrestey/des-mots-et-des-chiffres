import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./core/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#05070A",
        ivory: "#F6F1E8",
        gold: "#D7B56D",
        ink: "#10151C",
        panel: "#0D1218",
        line: "rgba(246, 241, 232, 0.14)"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(215, 181, 109, 0.16)",
        panel: "0 18px 50px rgba(0, 0, 0, 0.36)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;

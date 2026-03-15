import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          purple: "#7c3aed",
          blue: "#3b82f6",
          cyan: "#06b6d4",
        },
        dark: {
          DEFAULT: "#0a0a0f",
          100: "#12121c",
          200: "#1a1a2e",
          300: "#25253d",
          400: "#30304a",
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "float-slower": "float 14s ease-in-out 3s infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "33%": { transform: "translateY(-18px) translateX(12px)" },
          "66%": { transform: "translateY(10px) translateX(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
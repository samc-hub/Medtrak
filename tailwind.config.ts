import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1b2a2a",
        sage: { 50: "#f3f6f4", 100: "#e3ece7", 500: "#5a8a7d", 600: "#487267", 700: "#395a51" },
        clay: "#c4714f",
        paper: "#fbfaf6",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

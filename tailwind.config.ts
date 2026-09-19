import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canopy: {
          50: "#f2f7f2",
          100: "#e1ede1",
          200: "#c3dbc4",
          300: "#98c19b",
          400: "#69a171",
          500: "#40916c",
          600: "#2f7a5a",
          700: "#276149",
          800: "#1b4332",
          900: "#12302355",
          950: "#0c1f17",
        },
        soil: {
          100: "#efe6dd",
          300: "#c9a985",
          500: "#8a5a37",
          700: "#5c3a22",
          900: "#3a2314",
        },
        sun: {
          200: "#f6e6b4",
          400: "#e9c46a",
          600: "#c99a2e",
        },
        stone: {
          50: "#f7f6f2",
          100: "#efece4",
          200: "#dedad0",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-work-sans)", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "10px",
        xl: "16px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;

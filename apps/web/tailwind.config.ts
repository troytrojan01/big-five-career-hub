import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/content/content/**/*.{mdx,md}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        sand: "#fff8ec",
        sky: "#d9f2ff",
        mint: "#dff6e8",
        coral: "#ffefe0",
        slate: "#5f6a7d",
      },
      boxShadow: {
        float: "0 20px 80px rgba(17, 24, 39, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(17,24,39,0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [typography],
};

export default config;

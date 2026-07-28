import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cs: {
          bg: "#0d1117",
          panel: "#12181f",
          panel2: "#171f28",
          border: "#232b35",
          orange: "#f0a83c",
          orange2: "#de9b35",
          blue: "#4f9dde",
          gold: "#c9a24b",
          red: "#e14b4b",
          text: "#e8ecf1",
          muted: "#8a96a3",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "cs-grid":
          "linear-gradient(rgba(240,168,60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(240,168,60,0.05) 1px, transparent 1px)",
        "cs-glow":
          "radial-gradient(circle at top, rgba(240,168,60,0.15), transparent 60%)",
      },
      backgroundSize: {
        "cs-grid": "36px 36px",
      },
      boxShadow: {
        "cs-card": "0 0 0 1px rgba(240,168,60,0.08), 0 10px 30px -12px rgba(0,0,0,0.6)",
        "cs-glow": "0 0 24px rgba(240,168,60,0.35)",
      },
      clipPath: {
        card: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

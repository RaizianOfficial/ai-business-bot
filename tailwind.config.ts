import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C59080",     // Warm terracotta/rose
        secondary: "#E8D8CD",   // Soft beige
        accent: "#F4E0D6",      // Very light pink/beige
        background: "#F9F7F5",  // Off-white/cream
        textDark: "#2D2926",    // Deep charcoal
        glass: "rgba(255, 255, 255, 0.6)",
        glassDark: "rgba(0, 0, 0, 0.05)",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(197, 144, 128, 0.1)',
        'glass-hover': '0 8px 32px 0 rgba(197, 144, 128, 0.25)',
        'soft': '0 20px 40px -15px rgba(0,0,0,0.05)',
      },
      backdropBlur: {
        xs: "2px",
        md: "8px",
        lg: "16px",
      },
    },
  },
  plugins: [],
};
export default config;

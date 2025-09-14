/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary accent color (warm orange from image)
        primary: "#ff6b35",

        // Background colors (warm orange/brown palette from image)
        "bg-primary": "#d2691e",
        "bg-secondary": "#ff8c00",
        "bg-tertiary": "#cd853f",

        // Text colors (white text on dark backgrounds)
        "text-primary": "#ffffff",
        "text-secondary": "#ffffff",
        "text-accent": "#ffffff",

        // Interactive colors
        "interactive-active": "#ff6b35",
        "interactive-inactive": "#cd853f",
        "interactive-hover": "#ff8c00",

        // Border colors (warm orange tones)
        "border-primary": "#ffa500",
        "border-accent": "#ff6b35",

        // Status colors
        "status-success": "#16a34a",
        "status-warning": "#d97706",
        "status-error": "#dc2626",
      },
    },
  },
  plugins: [],
};

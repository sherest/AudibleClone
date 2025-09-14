/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary accent color (light cream from reference image)
        primary: "#f7da80",

        // Background colors (corrected based on reference image)
        "bg-primary": "#d97706",
        "bg-secondary": "#b3530a",
        "bg-tertiary": "#f7da80",

        // Text colors (white text on dark backgrounds)
        "text-primary": "#ffffff",
        "text-secondary": "#ffffff",
        "text-accent": "#ffffff",

        // Interactive colors
        "interactive-active": "#f7da80",
        "interactive-inactive": "#b3530a",
        "interactive-hover": "#d97706",

        // Border colors (light cream tones)
        "border-primary": "#f7da80",
        "border-accent": "#f7da80",

        // Status colors
        "status-success": "#16a34a",
        "status-warning": "#d97706",
        "status-error": "#dc2626",
      },
    },
  },
  plugins: [],
};

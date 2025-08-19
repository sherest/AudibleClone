/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './App.tsx'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary accent color (matching screenshot theme)
        primary: '#c50303',
        
        // Background colors (matching screenshot)
        'bg-primary': '#b90101',
        'bg-secondary': '#c50303',
        'bg-tertiary': '#bf1f1f',
        
        // Text colors (matching screenshot)
        'text-primary': '#ffffff',
        'text-secondary': '#ffffff',
        'text-accent': '#ffffff',
        
        // Interactive colors
        'interactive-active': '#c50303',
        'interactive-inactive': '#bf1f1f',
        'interactive-hover': '#a00000',
        
        // Border colors (matching screenshot)
        'border-primary': '#ffafa7',
        'border-accent': '#c50303',
        
        // Status colors
        'status-success': '#16a34a',
        'status-warning': '#d97706',
        'status-error': '#dc2626',
      },
    },
  },
  plugins: [],
};

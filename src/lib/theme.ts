export const theme = {
  colors: {
    // Primary accent color (light cream from reference image)
    primary: "#f7da80", // Light cream color for buttons and highlights

    // Background colors (corrected based on reference image)
    background: {
      primary: "#d97706", // Main screen background (warm orange)
      secondary: "#b3530a", // Card/header background (darker orange/brown)
      tertiary: "#f7da80", // Subtitle/button background (light cream)
    },

    // Text colors (white text on dark backgrounds)
    text: {
      primary: "#ffffff", // Main text color (white)
      secondary: "#ffffff", // Secondary text (also white for consistency)
      accent: "#ffffff", // Accent text (white)
    },

    // Interactive elements
    interactive: {
      active: "#f7da80", // Active states (light cream)
      inactive: "#b3530a", // Inactive states (darker orange)
      hover: "#d97706", // Hover states (main background color)
    },

    // Borders (warm orange tones)
    border: {
      primary: "#f7da80", // Card border color (light cream)
      accent: "#f7da80", // Accent border (light cream)
    },

    // Status colors
    status: {
      success: "#16a34a", // Green-600
      warning: "#d97706", // Amber-600
      error: "#dc2626", // Red-600
    },
  },

  // Spacing and sizing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 15,
    xl: 20,
  },
};

// Helper function to get theme colors
export const getThemeColor = (path: string) => {
  const keys = path.split(".");
  let value: any = theme;

  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Theme color not found: ${path}`);
      return "#c50303"; // fallback to primary
    }
  }

  return value;
};

// Type for theme colors
export type ThemeColors = typeof theme.colors;

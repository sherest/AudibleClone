export const theme = {
  colors: {
    // Primary accent color (warm orange from image)
    primary: "#ff6b35", // Orange accent color for buttons and highlights

    // Background colors (warm orange/brown palette from image)
    background: {
      primary: "#d2691e", // Main screen background (saddle brown)
      secondary: "#ff8c00", // Header, tab background (dark orange)
      tertiary: "#cd853f", // Card background (peru brown)
    },

    // Text colors (white text on dark backgrounds)
    text: {
      primary: "#ffffff", // Main text color (white)
      secondary: "#ffffff", // Secondary text (also white for consistency)
      accent: "#ffffff", // Accent text (white)
    },

    // Interactive elements
    interactive: {
      active: "#ff6b35", // Active states (orange accent)
      inactive: "#cd853f", // Inactive states (card color)
      hover: "#ff8c00", // Hover states (darker orange)
    },

    // Borders (warm orange tones)
    border: {
      primary: "#ffa500", // Card border color (orange)
      accent: "#ff6b35", // Accent border (primary orange)
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

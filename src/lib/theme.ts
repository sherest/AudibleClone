export const theme = {
  colors: {
    // Primary accent color (matching screenshot theme)
    primary: '#c50303', // Header/tab background color
    
    // Background colors (matching screenshot)
    background: {
      primary: '#b90101',    // Screen background color
      secondary: '#c50303',  // Header, tab background color
      tertiary: '#bf1f1f',   // Card background color
    },
    
    // Text colors (matching screenshot)
    text: {
      primary: '#ffffff',    // Main text color (white)
      secondary: '#ffffff',  // Secondary text (also white for consistency)
      accent: '#ffffff',     // Accent text (white)
    },
    
    // Interactive elements
    interactive: {
      active: '#c50303',     // Active states (header color)
      inactive: '#bf1f1f',   // Inactive states (card color)
      hover: '#a00000',      // Hover states (darker red)
    },
    
    // Borders (matching screenshot)
    border: {
      primary: '#ffafa7',    // Card border color (1px solid)
      accent: '#c50303',     // Accent border (header color)
    },
    
    // Status colors
    status: {
      success: '#16a34a',    // Green-600
      warning: '#d97706',    // Amber-600
      error: '#dc2626',      // Red-600
    }
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
  }
};

// Helper function to get theme colors
export const getThemeColor = (path: string) => {
  const keys = path.split('.');
  let value: any = theme;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Theme color not found: ${path}`);
      return '#c50303'; // fallback to primary
    }
  }
  
  return value;
};

// Type for theme colors
export type ThemeColors = typeof theme.colors;

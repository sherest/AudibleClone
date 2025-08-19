import { theme } from './theme';

// Predefined themes
export const themes = {
  screenshot: {
    primary: '#c50303',
    background: {
      primary: '#b90101',
      secondary: '#c50303',
      tertiary: '#bf1f1f',
    },
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
      accent: '#ffffff',
    },
    interactive: {
      active: '#c50303',
      inactive: '#bf1f1f',
      hover: '#a00000',
    },
    border: {
      primary: '#ffafa7',
      accent: '#c50303',
    },
    status: {
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
    }
  },
  
  red: {
    primary: '#dc2626',
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      accent: '#dc2626',
    },
    interactive: {
      active: '#dc2626',
      inactive: '#64748b',
      hover: '#b91c1c',
    },
    border: {
      primary: '#334155',
      accent: '#dc2626',
    },
    status: {
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
    }
  },
  
  blue: {
    primary: '#3b82f6',
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      accent: '#3b82f6',
    },
    interactive: {
      active: '#3b82f6',
      inactive: '#64748b',
      hover: '#2563eb',
    },
    border: {
      primary: '#334155',
      accent: '#3b82f6',
    },
    status: {
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
    }
  },
  
  green: {
    primary: '#16a34a',
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      accent: '#16a34a',
    },
    interactive: {
      active: '#16a34a',
      inactive: '#64748b',
      hover: '#15803d',
    },
    border: {
      primary: '#334155',
      accent: '#16a34a',
    },
    status: {
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
    }
  },
  
  purple: {
    primary: '#7c3aed',
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      accent: '#7c3aed',
    },
    interactive: {
      active: '#7c3aed',
      inactive: '#64748b',
      hover: '#6d28d9',
    },
    border: {
      primary: '#334155',
      accent: '#7c3aed',
    },
    status: {
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
    }
  },
  
  orange: {
    primary: '#ea580c',
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      accent: '#ea580c',
    },
    interactive: {
      active: '#ea580c',
      inactive: '#64748b',
      hover: '#c2410c',
    },
    border: {
      primary: '#334155',
      accent: '#ea580c',
    },
    status: {
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
    }
  }
};

export type ThemeName = keyof typeof themes;

// Function to get a specific theme
export const getTheme = (themeName: ThemeName) => {
  return themes[themeName] || themes.screenshot;
};

// Function to update the current theme
export const updateTheme = (themeName: ThemeName) => {
  const newTheme = getTheme(themeName);
  
  // Update the theme object
  Object.assign(theme.colors, newTheme);
  
  return theme;
};

// Function to get all available theme names
export const getAvailableThemes = (): ThemeName[] => {
  return Object.keys(themes) as ThemeName[];
};

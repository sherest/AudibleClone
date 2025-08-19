import React, { createContext, useContext, ReactNode } from 'react';
import { theme, ThemeColors } from '../lib/theme';

interface ThemeContextType {
  colors: ThemeColors;
  getColor: (path: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const getColor = (path: string): string => {
    const keys = path.split('.');
    let value: any = theme;
    
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        console.warn(`Theme color not found: ${path}`);
        return theme.colors.primary; // fallback to primary
      }
    }
    
    return value;
  };

  const contextValue: ThemeContextType = {
    colors: theme.colors,
    getColor,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

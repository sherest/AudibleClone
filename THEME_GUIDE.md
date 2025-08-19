# Theme System Guide

## Overview

The AudibleClone app now has a centralized theme system that allows you to change the entire app's color scheme from one place. This replaces the previous scattered hardcoded colors throughout the codebase.

## Current Theme: Screenshot Theme

The app is currently configured with the **screenshot theme** that matches the exact colors from the provided image:

- **Screen background**: `#b90101`
- **Header/Tab background**: `#c50303`
- **Card background**: `#bf1f1f`
- **Card border**: `#ffafa7` (1px solid)
- **Text color**: `#ffffff` (white)

## How to Change the Theme

### Option 1: Quick Theme Change (Recommended)

1. **Open** `src/lib/theme.ts`
2. **Find** the `theme` object
3. **Change** the colors to match your desired theme
4. **Save** the file

Example - Change to blue theme:
```typescript
export const theme = {
  colors: {
    primary: '#3b82f6', // Change this to blue
    background: {
      primary: '#0f172a',    // Dark background
      secondary: '#1e293b',  // Card background
      tertiary: '#334155',   // Border color
    },
    // ... other colors
  }
}
```

### Option 2: Use Predefined Themes

1. **Open** `src/lib/themeSwitcher.ts`
2. **Choose** from available themes: `screenshot`, `red`, `blue`, `green`, `purple`, `orange`
3. **Update** the main theme file to use your chosen theme

Example:
```typescript
// In src/lib/theme.ts
import { getTheme } from './themeSwitcher';

export const theme = {
  colors: getTheme('blue'), // Change 'blue' to any theme name
  // ... rest of theme config
}
```

### Option 3: Create Custom Theme

1. **Open** `src/lib/themeSwitcher.ts`
2. **Add** your custom theme to the `themes` object
3. **Use** it as shown in Option 2

## Available Predefined Themes

- **Screenshot** - Exact colors from the provided image (current theme)
  - Screen: `#b90101`, Header: `#c50303`, Cards: `#bf1f1f`, Border: `#ffafa7`, Text: `#ffffff`
- **Red** (`#dc2626`) - Modern red theme
- **Blue** (`#3b82f6`) - Professional blue
- **Green** (`#16a34a`) - Nature green
- **Purple** (`#7c3aed`) - Royal purple
- **Orange** (`#ea580c`) - Warm orange

## Theme Structure

The theme system organizes colors into logical groups:

```typescript
theme.colors = {
  primary: '#c50303',           // Main accent color (header/tab)
  
  background: {
    primary: '#b90101',         // Screen background
    secondary: '#c50303',       // Header, tab background
    tertiary: '#bf1f1f',        // Card background
  },
  
  text: {
    primary: '#ffffff',         // Main text (white)
    secondary: '#ffffff',       // Secondary text (white)
    accent: '#ffffff',          // Accent text (white)
  },
  
  interactive: {
    active: '#c50303',          // Active states
    inactive: '#bf1f1f',        // Inactive states
    hover: '#a00000',           // Hover states
  },
  
  border: {
    primary: '#ffafa7',         // Card borders (1px solid)
    accent: '#c50303',          // Accent borders
  },
  
  status: {
    success: '#16a34a',         // Success states
    warning: '#d97706',         // Warning states
    error: '#dc2626',           // Error states
  }
}
```

## How to Use Theme Colors in Components

### Method 1: Using the useTheme Hook

```typescript
import { useTheme } from '@/providers/ThemeProvider';

function MyComponent() {
  const { colors, getColor } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background.primary }}>
      <Text style={{ color: colors.text.primary }}>
        Hello World
      </Text>
    </View>
  );
}
```

### Method 2: Using Tailwind Classes

The theme colors are also available as Tailwind classes:

```typescript
// Background colors
className="bg-bg-primary"      // Screen background (#b90101)
className="bg-bg-secondary"    // Header background (#c50303)
className="bg-bg-tertiary"     // Card background (#bf1f1f)

// Text colors
className="text-text-primary"  // Main text (#ffffff)
className="text-text-secondary" // Secondary text (#ffffff)
className="text-text-accent"   // Accent text (#ffffff)

// Interactive colors
className="bg-interactive-active"   // Active state (#c50303)
className="bg-interactive-inactive" // Inactive state (#bf1f1f)
className="bg-interactive-hover"    // Hover state (#a00000)

// Border colors
className="border-border-primary"   // Card border (#ffafa7)
className="border-border-accent"    // Accent border (#c50303)
```

### Method 3: Direct Color Reference

```typescript
import { theme } from '@/lib/theme';

function MyComponent() {
  return (
    <View style={{ backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>
        Hello World
      </Text>
    </View>
  );
}
```

## Files Modified for Theme System

1. **`src/lib/theme.ts`** - Main theme configuration
2. **`src/lib/themeSwitcher.ts`** - Predefined themes and utilities
3. **`src/providers/ThemeProvider.tsx`** - Theme context provider
4. **`src/app/_layout.tsx`** - Added ThemeProvider to app
5. **`tailwind.config.js`** - Added theme colors to Tailwind

## Benefits of the New System

✅ **Centralized**: All colors defined in one place
✅ **Consistent**: Ensures color consistency across the app
✅ **Maintainable**: Easy to update and modify
✅ **Flexible**: Multiple ways to use theme colors
✅ **Type-safe**: Full TypeScript support
✅ **Future-proof**: Easy to add new themes

## Migration Status

The theme system is now in place, but some components may still use hardcoded colors. To complete the migration:

1. Replace hardcoded colors with theme references
2. Use the `useTheme` hook or Tailwind classes
3. Test the app to ensure all colors are properly themed

## Quick Color Reference (Screenshot Theme)

| Usage | Color Code | Tailwind Class |
|-------|------------|----------------|
| Screen background | `#b90101` | `bg-bg-primary` |
| Header/Tab background | `#c50303` | `bg-bg-secondary` |
| Card background | `#bf1f1f` | `bg-bg-tertiary` |
| Card border | `#ffafa7` | `border-border-primary` |
| Text color | `#ffffff` | `text-text-primary` |
| Primary accent | `#c50303` | `bg-primary`, `text-primary` |

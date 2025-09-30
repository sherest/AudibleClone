import { Platform } from "react-native";

export const Fonts = {
  // Bengali/Hindi font for Amrita Lahari content
  bengali: Platform.select({
    ios: "bf051hin-webfont",
    android: "bf051hin-webfont",
    web: "bf051hin-webfont",
  }),

  // Fallback fonts with proper font family names
  system: Platform.select({
    ios: "System",
    android: "Roboto",
    web: "system-ui",
  }),

  // Devanagari font for Sanskrit text
  devanagari: Platform.select({
    ios: "bf051hin-webfont",
    android: "bf051hin-webfont",
    web: "bf051hin-webfont",
  }),

  // Alternative font names to try
  alternative: Platform.select({
    ios: "bf051hin-webfont",
    android: "bf051hin-webfont",
    web: "bf051hin-webfont",
  }),
};

export const FontWeights = {
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
};

import { useState, useEffect } from "react";
import { loadFonts } from "./fontLoader";

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomFonts = async () => {
      try {
        console.log("Starting font loading...");
        await loadFonts();
        console.log("Fonts loaded successfully");
        setFontsLoaded(true);
      } catch (error) {
        console.error("Font loading error:", error);
        setFontError(
          error instanceof Error ? error.message : "Unknown font loading error"
        );
        setFontsLoaded(false);
      }
    };

    loadCustomFonts();
  }, []);

  return { fontsLoaded, fontError };
};

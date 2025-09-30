import { Platform } from "react-native";
import * as Font from "expo-font";

export const loadFonts = async () => {
  try {
    if (Platform.OS === "web") {
      // For web, we need to load fonts via CSS
      const fontFace = `
        @font-face {
          font-family: 'bf051hin-webfont';
          src: url('./assets/font/bf051hin-webfont.woff2') format('woff2'),
               url('./assets/font/bf051hin-webfont.woff') format('woff'),
               url('./assets/font/bf051hin-webfont.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
          unicode-range: U+0900-097F, U+0980-09FF, U+1CD0-1CFF;
        }
      `;

      // Inject font CSS into the document
      const style = document.createElement("style");
      style.textContent = fontFace;
      document.head.appendChild(style);
    } else {
      // For React Native, use expo-font to load fonts
      console.log("Loading custom fonts for React Native...");
      await Font.loadAsync({
        "bf051hin-webfont": require("../../assets/font/bf051hin-webfont.ttf"),
      });
      console.log("Custom fonts loaded successfully");
    }
  } catch (error) {
    console.error("Error loading fonts:", error);
  }

  return true;
};

import '../../global.css';
import { Slot } from 'expo-router';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';

import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import PlayerProvider from '@/providers/PlayerProvider';

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#010D1A',
    card: '#010D1A',
    primary: 'white',
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={theme}>
      <ClerkProvider tokenCache={tokenCache}>
        <PlayerProvider>
          <Slot />
        </PlayerProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}

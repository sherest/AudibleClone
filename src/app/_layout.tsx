import '../../global.css';
import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
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
      <PlayerProvider>
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen
            name='player'
            options={{ headerShown: false, animation: 'fade_from_bottom' }}
          />
        </Stack>
      </PlayerProvider>
    </ThemeProvider>
  );
}

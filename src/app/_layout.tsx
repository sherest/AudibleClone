import '../../global.css';
import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import PlayerProvider from '@/providers/PlayerProvider';
import { LanguageProvider } from '../providers/LanguageContext';
import { JoinUsProvider } from '../providers/JoinUsProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import JoinUsModal from '../components/JoinUsModal';

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
    <ThemeProvider>
      <LanguageProvider>
        <NavigationThemeProvider value={theme}>
          <PlayerProvider>
            <JoinUsProvider>
              <Stack>
                <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                <Stack.Screen
                  name='player'
                  options={{ headerShown: false, animation: 'fade_from_bottom' }}
                />
              </Stack>
              <JoinUsModal />
            </JoinUsProvider>
          </PlayerProvider>
        </NavigationThemeProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

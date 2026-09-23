import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { useColorScheme } from 'nativewind';

LogBox.ignoreLogs(['Codegen']);

export const unstable_settings = {
  anchor: '(tabs)',
};

const DefaultTheme = {
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: '#ffffff',
    card: '#ffffff',
    text: '#111827',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
  fonts: {
    regular: { fontFamily: '', fontWeight: 'normal' as const },
    medium: { fontFamily: '', fontWeight: 'normal' as const },
    bold: { fontFamily: '', fontWeight: 'normal' as const },
    heavy: { fontFamily: '', fontWeight: 'normal' as const },
  },
};

const DarkTheme = {
  dark: true,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: '#030712',
    card: '#030712',
    text: '#f9fafb',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  },
  fonts: DefaultTheme.fonts,
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme(); // follows system, manually togglable

  useEffect(() => {
    const bg = colorScheme === 'dark' ? '#030712' : '#ffffff';
    SystemUI.setBackgroundColorAsync(bg).catch(() => { });
  }, [colorScheme]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: colorScheme === 'dark' ? '#030712' : '#ffffff' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

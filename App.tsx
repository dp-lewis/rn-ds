import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme as NavTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { RootStackParamList } from './src/navigation/types';
import ArticleScreen from './src/screens/ArticleScreen';
import HomeScreen from './src/screens/HomeScreen';
import { ThemeProvider, useTheme, type Theme } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Hands our palette to React Navigation so its chrome matches the app. */
function toNavigationTheme(theme: Theme): NavTheme {
  const base = theme.mode === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: theme.mode === 'dark',
    colors: {
      ...base.colors,
      background: theme.color.surface.page,
      card: theme.color.surface.card,
      text: theme.color.text.primary,
      border: theme.color.border.hairline,
      primary: theme.color.signal,
    },
  };
}

function Navigation() {
  const theme = useTheme();

  return (
    <>
      <NavigationContainer theme={toNavigationTheme(theme)}>
        <Stack.Navigator
          screenOptions={{
            // Both screens draw their own headers so the article hero can run
            // full-bleed under the status bar.
            headerShown: false,
            contentStyle: { backgroundColor: theme.color.surface.page },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Article" component={ArticleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      {/*
        `brand` picks the masthead — swap it for 'tribune' or 'pulse' and the
        whole app re-skins, because components only read semantic tokens.
        No `mode` prop, so it follows the OS appearance setting.
      */}
      <ThemeProvider brand="meridian">
        <Navigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import './global.css';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Bold: require('../assets/fonts/Roboto-Bold.ttf'),
    Regular: require('../assets/fonts/Roboto-Regular.ttf'),
    Light: require('../assets/fonts/Roboto-Light.ttf'),
    Medium: require('../assets/fonts/Roboto-Medium.ttf'),
    Thin: require('../assets/fonts/Roboto-Thin.ttf'),
    Italic: require('../assets/fonts/Roboto-Italic.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{headerShown:false}} />
          <Stack.Screen name="+not-found" options={{headerShown: false}} />
        </Stack>
        <StatusBar style="auto" />
      </AppProvider>
    </AuthProvider>
     
  );
}

import React from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { darkTheme, lightTheme } from '@/hooks/colorTheme';
import { TouchableOpacity, useColorScheme, View } from 'react-native';
import { IconButton } from '@/components/IconButton';
import {
  ColorSchemeProvider,
  useColorSchemeContext,
} from '@/contexts/ColorSchmeContext';
import { Colors, CommonColors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Montserrat: require('@/assets/fonts/montserrat/Montserrat-VariableFont_wght.ttf'),
    MontserratItalic: require('@/assets/fonts/montserrat/Montserrat-Italic-VariableFont_wght.ttf'),
    Inter: require('@/assets/fonts/inter/Inter-VariableFont_opsz,wght.ttf'),
    InterItalic: require('@/assets/fonts/inter/Inter-Italic-VariableFont_opsz,wght.ttf'),
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
    <ColorSchemeProvider>
      <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>
        {/* <ThemeProvider value={lightTheme}> */}
        <Stack
          screenOptions={{
            headerShown: true,
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerTitle: '',
              headerStyle: {
                backgroundColor:
                  colorScheme === 'light'
                    ? Colors.light.header
                    : Colors.dark.header,
              },
            }}
          />
          <Stack.Screen
            name="product"
            options={{
              // headerShown: false,
              headerLeft: () => (
                <IconButton
                  icon="chevron-back"
                  size={30}
                  color="white"
                  onPress={() => {
                    router.back();
                  }}
                />
              ),
              headerStyle: {
                backgroundColor: Colors.light.header,
              },
              headerTitle: 'Product',
              headerTitleStyle: {
                color: 'white',
              },
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerTitle: '',
              headerStyle: {
                backgroundColor:
                  colorScheme === 'light'
                    ? Colors.light.header
                    : Colors.dark.header,
              },
              headerLeft: () => (
                <IconButton
                  icon="chevron-back"
                  size={30}
                  color="white"
                  onPress={() => {
                    router.back();
                  }}
                />
              ),
            }}
          />

          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ColorSchemeProvider>
  );
}

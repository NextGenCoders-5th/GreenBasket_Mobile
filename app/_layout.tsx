import React from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { darkTheme, lightTheme } from '@/hooks/colorTheme';
import { StyleSheet, useColorScheme } from 'react-native';
import { ColorSchemeProvider } from '@/contexts/ColorSchmeContext';
import { useColorTheme } from '@/hooks/useColorTheme';
import CustomHeader from '@/components/CustomHeader';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const colors = useColorTheme();

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

  const styles = StyleSheet.create({
    header: {
      backgroundColor: colorScheme === 'light' ? 'red' : 'blue',
      height: 40,
    },
  });

  return (
    <ColorSchemeProvider>
      <Provider store={store}>
        {/* <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}> */}
        <ThemeProvider value={lightTheme}>
          <Stack
            screenOptions={{
              headerShown: true,
              header: () => <CustomHeader />,
            }}
          >
            <Stack.Screen name='(tabs)' />
            <Stack.Screen name='product' />
            <Stack.Screen name='(auth)' />

            <Stack.Screen name='+not-found' />
          </Stack>
          <StatusBar style='auto' />
          <Toast
            position='top'
            visibilityTime={4000}
            autoHide={true}
            topOffset={50}
            keyboardOffset={50}
            onPress={() => {
              Toast.hide();
            }}
          />
        </ThemeProvider>
      </Provider>
    </ColorSchemeProvider>
  );
}

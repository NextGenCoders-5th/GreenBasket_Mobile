import React from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { darkTheme, lightTheme } from '@/hooks/colorTheme';
import { useColorScheme, View } from 'react-native';
import { IconButton } from '@/components/IconButton';
import { ColorSchemeProvider } from '@/contexts/ColorSchmeContext';

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
        <Stack screenOptions={{}}>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen
            name='product'
            options={{
              headerLeft: () => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    height: '100%',
                  }}
                >
                  <IconButton
                    icon='chevron-back'
                    size={30}
                    color='white'
                    onPress={() => {
                      router.navigate('/');
                    }}
                  />
                </View>
              ),
              headerStyle: {
                backgroundColor: '#53b175',
              },
              headerTitle: 'Product',
              headerTitleStyle: {
                color: 'white',
              },
              headerShown: true,
            }}
          />
          <Stack.Screen name='(auth)/signin' options={{ headerShown: false }} />
          <Stack.Screen name='(auth)/signup' options={{ headerShown: false }} />

          <Stack.Screen name='+not-found' />
        </Stack>
        <StatusBar style='auto' />
      </ThemeProvider>
    </ColorSchemeProvider>
  );
}

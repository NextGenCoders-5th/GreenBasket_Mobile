import React, { useEffect } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import {
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
  Text,
} from 'react-native'; // Added Text
import { Provider, useSelector } from 'react-redux';

import { darkTheme, lightTheme } from '@/styles/colorTheme';
import { ColorSchemeProvider } from '@/contexts/ColorSchmeContext';
import CustomHeader from '@/components/ui/CustomHeader';
import { store } from '@/redux/store';
import { useAuth } from '@/hooks/useAuth'; // <-- IMPORT useAuth
import { selectIsAuthLoading } from '@/redux/slices/authSlice'; // <-- IMPORT selector

SplashScreen.preventAutoHideAsync();

function AuthStateGate({ children }: { children: React.ReactNode }) {
  useAuth();
  const isAuthLoading = useSelector(selectIsAuthLoading);
  const currentColorScheme = useColorScheme(); // For theming the loader

  console.log('_layout.tsx AuthStateGate: isAuthLoading =', isAuthLoading);

  if (isAuthLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor:
              currentColorScheme === 'dark'
                ? darkTheme.colors.background
                : lightTheme.colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size='large'
          color={
            currentColorScheme === 'dark'
              ? darkTheme.colors.primary
              : lightTheme.colors.primary
          }
        />
        <Text
          style={{
            marginTop: 10,
            color:
              currentColorScheme === 'dark'
                ? darkTheme.colors.text
                : lightTheme.colors.text,
            fontFamily: 'Inter-Regular',
          }}
        >
          Loading session...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // This hides the splash screen. It's called after fonts are loaded
    // AND after AuthStateGate has determined the auth loading is complete.
    SplashScreen.hideAsync();
  }, []); // Runs once when RootLayoutContent mounts

  return (
    <ColorSchemeProvider>
      <Provider store={store}>
        {/* <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}> */}
        <ThemeProvider value={lightTheme}>
          <AuthStateGate>
            {/* AuthStateGate ensures auth is checked before Stack renders */}
            <Stack
              screenOptions={{
                header: () => <CustomHeader />,
              }}
            >
              <Stack.Screen name='(address)' />
              <Stack.Screen name='(auth)' />
              <Stack.Screen name='(tabs)' />
              <Stack.Screen name='(cart)' />
              <Stack.Screen name='(order)' />
              <Stack.Screen name='(product)' />
              <Stack.Screen name='(profile)' />
              <Stack.Screen name='+not-found' />
            </Stack>
          </AuthStateGate>
          <StatusBar style='auto' />
          <Toast /* ...props... */ />
        </ThemeProvider>
      </Provider>
    </ColorSchemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Montserrat: require('@/assets/fonts/montserrat/Montserrat-VariableFont_wght.ttf'),
    MontserratItalic: require('@/assets/fonts/montserrat/Montserrat-Italic-VariableFont_wght.ttf'),
    Inter: require('@/assets/fonts/inter/Inter-VariableFont_opsz,wght.ttf'),
    InterItalic: require('@/assets/fonts/inter/Inter-Italic-VariableFont_opsz,wght.ttf'),
  });

  // This useEffect is just for the font loading part.
  // SplashScreen.hideAsync() is now handled in RootLayoutContent.
  useEffect(() => {
    if (loaded) {
      // We don't hide splash here anymore, RootLayoutContent will do it
      // after AuthStateGate is also done.
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutContent />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

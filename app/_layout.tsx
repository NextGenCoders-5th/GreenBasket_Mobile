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
  // Removed useColorScheme from react-native
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Provider, useSelector } from 'react-redux';

import { darkTheme, lightTheme } from '@/styles/colorTheme';
// Import useColorScheme hook and ColorSchemeProvider
import {
  ColorSchemeProvider,
  useColorScheme,
} from '@/contexts/ColorSchmeContext';
import CustomHeader from '@/components/ui/CustomHeader';
import { store } from '@/redux/store';
import { useAuth } from '@/hooks/useAuth';
import { selectIsAuthLoading } from '@/redux/slices/authSlice';

SplashScreen.preventAutoHideAsync();

function AuthStateGate({ children }: { children: React.ReactNode }) {
  useAuth(); // This hook is responsible for loading initial auth state and dispatching
  const isAuthLoading = useSelector(selectIsAuthLoading);
  // Use the color scheme context hook
  const { colorScheme: activeColorScheme, isLoaded: isColorSchemeLoaded } =
    useColorScheme();

  // Show loading indicator while initial auth is loading OR color scheme preference is loading
  if (isAuthLoading || !isColorSchemeLoaded) {
    // Use colors based on the determined activeColorScheme
    const themeColors =
      activeColorScheme === 'dark' ? darkTheme.colors : lightTheme.colors;
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: themeColors.background,
          },
        ]}
      >
        <ActivityIndicator size='large' color={themeColors.primary} />
        <Text
          style={{
            marginTop: 10,
            color: themeColors.text,
            fontFamily: 'Inter-Regular',
          }}
        >
          Loading session and theme...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

function RootLayoutContent() {
  // Get the active color scheme from the context
  const { colorScheme: activeColorScheme } = useColorScheme();

  useEffect(() => {
    // This hides the splash screen. It's called after fonts are loaded
    // AND after AuthStateGate (which includes auth loading and color scheme loading) is complete.
    SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      {/* Use the activeColorScheme from context to select the theme object */}
      <ThemeProvider
        value={activeColorScheme === 'dark' ? darkTheme : lightTheme}
      >
        <AuthStateGate>
          {/* AuthStateGate ensures auth and theme are loaded before Stack renders */}
          <Stack
            screenOptions={{
              header: () => <CustomHeader />,
            }}
          >
            <Stack.Screen name='(auth)' />
            <Stack.Screen name='(address)' />
            <Stack.Screen name='(tabs)' />
            <Stack.Screen name='(cart)' />
            <Stack.Screen name='(order)' />
            <Stack.Screen name='(product)' />
            <Stack.Screen name='(profile)' />
            <Stack.Screen name='+not-found' />
          </Stack>
        </AuthStateGate>
        {/* Adjust StatusBar style based on active color scheme if needed */}
        <StatusBar style={activeColorScheme === 'dark' ? 'light' : 'dark'} />
        <Toast /* ...props... */ />
      </ThemeProvider>
    </Provider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Montserrat: require('@/assets/fonts/montserrat/Montserrat-VariableFont_wght.ttf'),
    MontserratItalic: require('@/assets/fonts/montserrat/Montserrat-Italic-VariableFont_wght.ttf'),
    Inter: require('@/assets/fonts/inter/Inter-VariableFont_opsz,wght.ttf'),
    InterItalic: require('@/assets/fonts/inter/Inter-Italic-VariableFont_opsz,wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // SplashScreen.hideAsync() is handled in RootLayoutContent
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Wrap the entire RootLayoutContent with ColorSchemeProvider
  return (
    <ColorSchemeProvider>
      <RootLayoutContent />
    </ColorSchemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React from 'react';
import { Stack } from 'expo-router';
import { useColorTheme } from '@/hooks/useColorTheme';

export default function ProductLayout() {
  const colors = useColorTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary, // Color of back arrow and title if no custom titleStyle
        headerTitleStyle: {
          color: colors['gray-900'],
          fontFamily: 'Inter-SemiBold', // Ensure you have this font
        },
        headerBackTitleStyle: {
          fontFamily: 'Inter-Regular', // Ensure you have this font
        },
      }}
    />
  );
}

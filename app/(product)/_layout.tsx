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
    >
      <Stack.Screen
        name='[id]' // Matches app/(product)/[id].tsx
        options={{
          title: 'Product Details', // Default title, overridden by the screen
        }}
      />

      {/* Add the new dynamic route for category product lists */}
      <Stack.Screen
        name='category/[categoryId]' // Matches app/(product)/category/[categoryId].tsx
        options={{
          title: 'Category Products', // Default title, overridden by the screen
        }}
      />
    </Stack>
  );
}

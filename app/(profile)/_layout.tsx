import React from 'react';
import { Stack } from 'expo-router';
import { useColorTheme } from '@/hooks/useColorTheme';
import CustomHeader from '@/components/ui/CustomHeader';

export default function _layout() {
  const colors = useColorTheme();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='[id]' options={{}} />
      <Stack.Screen
        name='accountInfo'
        options={{
          headerTitle: 'Account Information',
          headerTintColor: colors['gray-900'],
          headerStyle: {
            backgroundColor: colors['gray-50'],
          },
        }}
      />
    </Stack>
  );
}

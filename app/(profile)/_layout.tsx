import React from 'react';
import { Stack } from 'expo-router';
import { useColorTheme } from '@/hooks/useColorTheme';

export default function ProfileLayout() {
  const colors = useColorTheme();

  return (
    <Stack screenOptions={{}}>
      {/* The profile screen itself */}
      <Stack.Screen
        name='[id]'
        options={{
          headerTitle: 'Profile', // Or the user's name dynamically
        }}
      />

      {/* Add the address list screen */}
      <Stack.Screen
        name='complete-onboarding'
        options={{
          headerTitle: 'Complete Your profile information',
        }}
      />
    </Stack>
  );
}

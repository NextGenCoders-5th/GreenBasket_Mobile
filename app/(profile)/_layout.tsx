import React from 'react';
import { Stack } from 'expo-router';
import { useColorTheme } from '@/hooks/useColorTheme';
import CustomHeader from '@/components/ui/CustomHeader';

export default function ProfileLayout() {
  const colors = useColorTheme();
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name='[id]' options={{}} />
      <Stack.Screen name='complete-onboarding' options={{}} />
    </Stack>
  );
}

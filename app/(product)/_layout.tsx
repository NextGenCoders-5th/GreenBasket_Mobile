import { Stack } from 'expo-router';
import React from 'react';

export default function ProductLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='  index' options={{ headerTitle: 'Product' }} />
    </Stack>
  );
}

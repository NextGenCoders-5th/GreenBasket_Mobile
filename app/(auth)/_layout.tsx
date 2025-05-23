import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header by default for auth flow
      }}
    >
      <Stack.Screen name='signin' />
      <Stack.Screen name='signup' />
      {/* Add the new update-password screen */}
      <Stack.Screen
        name='update-password'
        options={{
          headerShown: true, // Show header for this screen
          headerTitle: 'Change Password', // Set a header title
          // Customize header style if needed
          // headerStyle: { backgroundColor: '...' },
          // headerTintColor: '...',
        }}
      />
      {/* Add other auth related screens like forgot password if needed */}
    </Stack>
  );
}

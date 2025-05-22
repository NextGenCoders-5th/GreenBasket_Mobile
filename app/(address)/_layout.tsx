// app/(address)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import CustomHeader from '@/components/ui/CustomHeader'; // Assuming you want your custom header

export default function AddressLayout() {
  return (
    <Stack
      screenOptions={
        {
          // You can set a default header here or in individual screens
          // header: () => <CustomHeader />,
        }
      }
    >
      {/* The index route for listing addresses */}
      <Stack.Screen
        name='address'
        options={{
          title: 'My Address',
          // Customize header here if different from default
        }}
      />
      {/* The route for creating a new address */}
      <Stack.Screen
        name='create'
        options={{
          title: 'Add New Address',
        }}
      />
      {/* The dynamic route for editing a specific address by ID */}
      {/* Adjust name to 'edit' if using a single edit screen without ID */}
      <Stack.Screen
        name='edit'
        options={{
          title: 'Edit Address',
        }}
      />
      {/* Add more screens if needed, e.g., a screen to view a single address */}
    </Stack>
  );
}

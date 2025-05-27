import React from 'react';
import { Stack } from 'expo-router';
import CustomHeader from '@/components/ui/CustomHeader';

export default function OrderLayout() {
  return (
    <Stack
      screenOptions={
        {
          // header: () => <CustomHeader />,
        }
      }
    >
      {/* This is the Order History List screen */}
      <Stack.Screen
        name='order-history' // This should be the default screen for the group
        options={{
          title: 'My Orders',
        }}
      />
      {/* The dynamic route for a single order summary */}
      <Stack.Screen
        name='[orderId]'
        options={{
          title: 'Continue payment', // Default title, overridden by the screen
        }}
      />
      {/* The Place Order screen */}
      <Stack.Screen
        name='place-order'
        options={{
          title: 'Place Order',
        }}
      />
      {/* Add other order-related screens if needed */}
    </Stack>
  );
}

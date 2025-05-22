// app/(order)/_layout.tsx
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
      {/* Other order screens */}
      <Stack.Screen
        name='place-order' // Define the route name
        options={{
          title: 'Place Order',
        }}
      />
      {/* The dynamic route for the order summary/details */}
      <Stack.Screen
        name='[orderId]' // For Order Summary Screen
        options={{
          title: 'Order Summary',
        }}
      />
      {/* ... other order-related screens ... */}
    </Stack>
  );
}

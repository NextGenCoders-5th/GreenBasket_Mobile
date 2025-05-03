import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartScreen from '@/components/cart/CartScreen';

export default function Cart() {
  return (
    <SafeAreaView>
      <CartScreen />
    </SafeAreaView>
  );
}

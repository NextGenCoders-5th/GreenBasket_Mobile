import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import ProductScreen from '@/screens/ProductScreen';

export default function Product() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ProductScreen />
    </SafeAreaView>
  );
}

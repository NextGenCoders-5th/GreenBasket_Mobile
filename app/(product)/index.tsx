import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import ProductScreen from '@/components/product/ProductScreen';

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

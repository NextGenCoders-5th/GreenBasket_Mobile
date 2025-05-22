import { View, Text } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { useColorTheme } from '@/hooks/useColorTheme';
import ProductsList from '@/components/product/productsList';

export default function explore() {
  const colors = useColorTheme();

  return (
    <View style={{ flex: 1, paddingVertical: 10 }}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          height: 60,
          borderRadius: 50,
          borderColor: colors['gray-300'],
          borderWidth: 2,
          backgroundColor: colors.background,
          marginHorizontal: 5,
        }}
      >
        <AntDesign
          name='search1'
          size={22}
          color={colors['gray-300']}
          style={{ paddingLeft: 10 }}
        />
        <TextInput
          placeholder='Search...'
          style={{
            color: colors['gray-700'],
            flex: 1,
            paddingVertical: 15,
            paddingHorizontal: 10,
            borderRadius: 50,
            fontSize: 16,
            fontFamily: 'Inter',
            fontWeight: '500',
            outline: 'none',
          }}
        />
      </View>
      <ProductsList />
    </View>
  );
}

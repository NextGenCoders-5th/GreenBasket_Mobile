import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import React from 'react';
import { TextInput, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { useColorTheme } from '@/hooks/useColorTheme';
import ProductsList from '@/components/product/productsList';
import { router } from 'expo-router';
import TextButton from '@/components/ui/TextButton';
import { useAuth } from '@/hooks/useAuth';

export default function HomeScreen() {
  const colors = useColorTheme();

  return (
    <ScrollView
      style={{
        display: 'flex',
        padding: 5,
        marginBottom: 10,
      }}
    >
      {/* Search Bar */}
      <View
        style={{
          marginBottom: 10,
        }}
      >
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            flex: 1,
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
        <TextButton
          title='sign in'
          onPress={() => router.navigate('/signin')}
          style={{
            width: '30%',
          }}
        />
      </View>

      <ProductsList />
    </ScrollView>
  );
}

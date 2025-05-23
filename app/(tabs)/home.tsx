import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
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
      contentContainerStyle={{
        padding: 5,
        // marginBottom: 10,
        backgroundColor: colors['primary-100'],
      }}
    >
      <View
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors['primary-500'],
        }}
      >
        <Text>Home</Text>
      </View>
    </ScrollView>
  );
}

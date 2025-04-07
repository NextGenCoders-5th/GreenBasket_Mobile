import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useColorTheme } from '@/hooks/useColorTheme';

export default function CustomHeader({ title = 'Title', showBack = false }) {
  const colors = useColorTheme();

  return (
    <SafeAreaView
      style={{
        height: 30,
        backgroundColor: colors.background,
      }}
    ></SafeAreaView>
  );
}

import React from 'react';
import { SafeAreaView, StyleProp, ViewStyle } from 'react-native';
import { useColorTheme } from '@/hooks/useColorTheme';

type CustomHeaderProps = {
  style?: StyleProp<ViewStyle>;
};

export default function CustomHeader({ style }: CustomHeaderProps) {
  const colors = useColorTheme();

  return (
    <SafeAreaView
      style={[
        {
          height: 30,
          backgroundColor: colors.primary,
        },
        style,
      ]}
    ></SafeAreaView>
  );
}

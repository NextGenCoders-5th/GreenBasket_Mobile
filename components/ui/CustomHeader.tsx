import React from 'react';
import { SafeAreaView, StyleProp, ViewStyle } from 'react-native';
import { useColorTheme } from '@/hooks/useColorTheme';
import { useColorScheme } from '@/contexts/ColorSchmeContext';

type CustomHeaderProps = {
  style?: StyleProp<ViewStyle>;
};

export default function CustomHeader({ style }: CustomHeaderProps) {
  const colors = useColorTheme();
  const { colorScheme: activeColorScheme } = useColorScheme();

  return (
    <SafeAreaView
      style={[
        {
          height: 30,
          backgroundColor:
            activeColorScheme === 'light'
              ? colors.primary
              : colors['primary-100'],
        },
        style,
      ]}
    ></SafeAreaView>
  );
}

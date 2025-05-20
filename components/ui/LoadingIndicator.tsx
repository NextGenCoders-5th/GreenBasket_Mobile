import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { useColorTheme } from '@/hooks/useColorTheme';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'large' | 'small' | number;
  color?: string;
}

export default function LoadingIndicator({
  message = 'Loading...',
  size = 'large',
  color = '#75c191',
}: LoadingIndicatorProps) {
  const colors = useColorTheme();
  return (
    <SafeAreaView
      style={[styles.centered, { backgroundColor: colors.background }]}
    >
      <ActivityIndicator size={size} color={color} />
      <Text
        style={{
          color: colors['gray-700'],
          marginTop: 10,
          fontFamily: 'Inter-Regular',
        }}
      >
        {message}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

import { View, Text, ViewStyle, StyleSheet } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

import { useColorTheme } from '@/hooks/useColorTheme';
import TextButton from '@/components/ui/TextButton';

interface SignInProps {
  style?: ViewStyle;
  message?: string;
}

export default function SignIn({
  message = 'You are not logged in. Please log in.',
  style,
}: SignInProps) {
  const colors = useColorTheme();
  return (
    <View style={{ ...styles.container, ...style }}>
      <Text style={{ ...styles.welcomeText, color: colors['gray-700'] }}>
        Welcome to{' '}
        <Text style={{ fontWeight: 900, color: colors['gray-900'] }}>
          MiniExpress
        </Text>
      </Text>
      <Text style={{ ...styles.message, color: colors['gray-700'] }}>
        {message}
      </Text>
      <TextButton
        style={{
          width: 170,
        }}
        title='Sign in / Register'
        onPress={() => {
          router.navigate('/(auth)/signin');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  welcomeText: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
  },
  message: {
    fontWeight: 300,
    fontSize: 16,
  },
});

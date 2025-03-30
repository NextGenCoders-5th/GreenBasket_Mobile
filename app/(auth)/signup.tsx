import { View, Text, Button, SafeAreaView } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import SignUpForm from '@/components/form/SignUpForm';
import { useColorTheme } from '@/hooks/useColorTheme';

export default function SignUp() {
  const colors = useColorTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors['primary-50'],
      }}
    >
      <SignUpForm />
    </SafeAreaView>
  );
}

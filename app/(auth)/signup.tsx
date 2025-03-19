import { View, Text, Button } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import SignUpForm from '@/components/ui/SignUpForm';

export default function SignUp() {
  return (
    <View>
      <SignUpForm />
    </View>
  );
}

import { Dimensions, SafeAreaView } from 'react-native';
import React from 'react';
import AccountScreen from '@/components/profile/AccountScreen';
import { useColorTheme } from '@/hooks/useColorTheme';

export default function Account() {
  const colors = useColorTheme();
  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        minHeight: Dimensions.get('window').height,
      }}
    >
      <AccountScreen />
    </SafeAreaView>
  );
}

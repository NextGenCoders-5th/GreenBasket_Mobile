// app/(address)/create.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import Toast from 'react-native-toast-message';

import AddressForm from '@/components/address/AddressForm';
import { useColorTheme } from '@/hooks/useColorTheme';
import { useCreateUserAddressMutation } from '@/redux/api/addressApi';
import { AddressFormData } from '@/utils/validators';

export default function CreateAddressScreen() {
  const colors = useColorTheme();
  const [createUserAddress, { isLoading }] = useCreateUserAddressMutation();

  const handleSubmitAddress = async (formData: AddressFormData) => {
    try {
      Toast.show({
        type: 'info',
        text1: 'Creating Address...',
      });
      await createUserAddress(formData).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Address Created',
        text2: 'Your new address has been saved.',
      });
      router.back(); // Navigate back after successful creation
    } catch (err: any) {
      console.error('Failed to create address:', err);
      const message = err?.data?.message || 'Could not save address.';
      Toast.show({
        type: 'error',
        text1: 'Creation Failed',
        text2: message,
      });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Stack.Screen options={{ title: 'Add New Address' }} />
      <AddressForm onSubmit={handleSubmitAddress} isLoading={isLoading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
});

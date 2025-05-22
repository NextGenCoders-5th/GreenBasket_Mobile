import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Stack, router } from 'expo-router'; // Remove useLocalSearchParams
import Toast from 'react-native-toast-message';

import AddressForm from '@/components/address/AddressForm';
import { useColorTheme } from '@/hooks/useColorTheme';
import {
  // Remove useGetUserAddressQuery
  useUpdateUserAddressMutation, // Keep the update mutation
} from '@/redux/api/addressApi';
import { AddressFormData } from '@/utils/validators'; // Correct schema import path
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import { useCurrentUser } from '@/hooks/useCurrentUser'; // Import useCurrentUser
import Button from '@/components/ui/Button'; // Import Button

export default function EditAddressScreen() {
  const colors = useColorTheme();
  // Removed getting ID from params

  // Use the useCurrentUser hook to get the user and their address
  const {
    user,
    isLoading: isUserLoading,
    error: userError,
    refetchCurrentUser,
  } = useCurrentUser();

  const [updateUserAddress, { isLoading: isUpdatingAddress }] =
    useUpdateUserAddressMutation();

  // Access the address directly from the user object
  const existingAddress = user?.address;

  // Map the existing Address data to AddressFormData format for the form
  const initialValues: AddressFormData | undefined = existingAddress
    ? {
        country: existingAddress.country,
        city: existingAddress.city,
        sub_city: existingAddress.sub_city,
        street: existingAddress.street,
        zip_code: existingAddress.zip_code,
        latitude: existingAddress.latitude ?? undefined,
        longitude: existingAddress.longitude ?? undefined,
      }
    : undefined;

  // Handle loading and error states for fetching user data
  if (isUserLoading) {
    return <LoadingIndicator message='Loading user address...' />;
  }

  // Handle errors for fetching user data
  if (userError) {
    const errorMessage =
      (userError as any)?.data?.message || 'Failed to load user address.';
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <LoadingError message={errorMessage} onRetry={refetchCurrentUser} />
      </View>
    );
  }

  // If the user object is loaded but has no address, prompt to create one
  if (!existingAddress) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.noAddressText, { color: colors['gray-700'] }]}>
          You don't have an address saved yet.
        </Text>
        <Button
          title='Add Address'
          onPress={() => router.replace('/(address)/create')}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  const handleSubmitAddress = async (formData: AddressFormData) => {
    try {
      Toast.show({
        type: 'info',
        text1: 'Updating Address...',
      });
      // Call the update mutation with the form data
      await updateUserAddress(formData).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Address Updated',
        text2: 'Your address has been saved.',
      });
      router.back(); // Navigate back after successful update
    } catch (err: any) {
      console.error('Failed to update address:', err);
      const message = err?.data?.message || 'Could not update address.';
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: message,
      });
    }
  };

  // Render the form only if address data is available (handled by the checks above)
  if (!initialValues) {
    // This should not be reached if the checks above are correct, but as a safeguard
    return null;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Stack.Screen options={{ title: 'Edit Address' }} />
      <AddressForm
        initialValues={initialValues}
        onSubmit={handleSubmitAddress}
        isLoading={isUpdatingAddress}
        submitButtonText='Update Address'
      />
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noAddressText: {
    // Added style for no address message
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 20,
  },
});

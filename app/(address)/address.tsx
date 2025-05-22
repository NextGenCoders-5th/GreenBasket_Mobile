import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native'; // Added ScrollView for potentially long addresses
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorTheme } from '@/hooks/useColorTheme';
import Button from '@/components/ui/Button';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import { useCurrentUser } from '@/hooks/useCurrentUser'; // Import useCurrentUser

export default function AddressScreen() {
  // Renamed component
  const colors = useColorTheme();

  // Use the useCurrentUser hook to get the user and their address
  const {
    user,
    isLoading: isUserLoading,
    error: userError,
    refetchCurrentUser,
  } = useCurrentUser();

  // Access the address directly from the user object
  const userAddress = user?.address;

  // Handle loading and error states for fetching user data
  if (isUserLoading) {
    return <LoadingIndicator message='Loading user address...' />;
  }

  // Handle errors for fetching user data
  if (userError) {
    const errorMessage =
      (userError as any)?.data?.message || 'Failed to load user address.';
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <LoadingError message={errorMessage} onRetry={refetchCurrentUser} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: 'My Addresses' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors['gray-900'] }]}>
          Shipping Address
        </Text>

        {/* If the user object is loaded but has no address, display empty state */}
        {!userAddress ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors['gray-600'] }]}>
              You don't have an address saved yet.
            </Text>
            <Button
              title='Add Your Address'
              onPress={() => router.push('/(address)/create')}
              style={styles.addButton}
            />
          </View>
        ) : (
          // Display the single address
          <View
            style={[styles.addressCard, { borderColor: colors['gray-200'] }]}
          >
            <Text style={[styles.addressText, { color: colors['gray-700'] }]}>
              {userAddress.street}
            </Text>
            <Text
              style={[styles.addressText, { color: colors['gray-700'] }]}
            >{`${userAddress.sub_city}, ${userAddress.city}, ${userAddress.country}`}</Text>
            <Text style={[styles.addressText, { color: colors['gray-700'] }]}>
              Zip: {userAddress.zip_code}
            </Text>
            {/* Optionally display latitude/longitude */}
            {/* {userAddress.latitude != null && userAddress.longitude != null && (
              <Text style={[styles.addressText, { color: colors['gray-700'] }]}>Lat/Lng: {userAddress.latitude}, {userAddress.longitude}</Text>
            )} */}
            {userAddress.is_default && (
              <Text
                style={[
                  styles.defaultBadge,
                  { color: colors.primary, borderColor: colors.primary },
                ]}
              >
                Default
              </Text>
            )}

            {/* Link to edit this address */}
            <Button
              title='Edit Address'
              onPress={() => router.push('/(address)/edit')} // Navigate to the non-dynamic edit screen
              style={styles.editButton}
              //  variant="outline"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContent: {
    // Applied padding to ScrollView content container
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
  },
  addressCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  addressText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 5,
  },
  defaultBadge: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  editButton: {
    marginTop: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    marginTop: 10,
  },
});

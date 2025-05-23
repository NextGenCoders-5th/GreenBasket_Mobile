// app/(order)/index.tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useSelector } from 'react-redux';

import { useColorTheme } from '@/hooks/useColorTheme';
import Button from '@/components/ui/Button';
import { useGetMyOrdersQuery } from '@/redux/api/orderApi';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import { selectIsAuthenticated } from '@/redux/slices/authSlice';
import OrderCard from '@/components/order/OrderCard';
import { Order } from '@/types/order';
import { useAuth } from '@/hooks/useAuth'; // <-- Import useAuth hook
import SignIn from '@/components/account/SignIn'; // <-- Import SignIn component

export default function OrderHistoryScreen() {
  const colors = useColorTheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { isLoading: isAuthLoading } = useAuth(); // <-- Get initial auth loading state

  const {
    data: ordersResponse,
    error: ordersError,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
    refetch: refetchOrders,
  } = useGetMyOrdersQuery(undefined, {
    skip: !isAuthenticated, // Skip the query if the user is not authenticated
  });

  const orders = ordersResponse?.data?.data || [];

  // Show initial auth loading state
  if (isAuthLoading) {
    return <LoadingIndicator message='Checking authentication...' />;
  }

  // If not authenticated after auth loading is complete, show sign-in prompt
  if (!isAuthenticated) {
    return <SignIn message='Please sign in to view your order history.' />;
  }

  // Now that we know the user is authenticated, handle order data loading and errors

  // Show loading state for orders (only if authenticated)
  if (isOrdersLoading && !isOrdersFetching && orders.length === 0) {
    return <LoadingIndicator message='Loading orders...' />;
  }

  // Handle error state for orders (only if authenticated)
  if (ordersError) {
    const errorMessage =
      (ordersError as any)?.data?.message ||
      'Failed to load your order history.';
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <LoadingError message={errorMessage} onRetry={refetchOrders} />
      </SafeAreaView>
    );
  }

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors['gray-700'] }]}>
        You haven't placed any orders yet.
      </Text>
      <Button
        title='Start Shopping'
        onPress={() => router.push('/(tabs)/home')}
        style={{ marginTop: 20, width: '60%' }}
      />
    </View>
  );

  // Render the list if authenticated and not in a primary loading/error state
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors['gray-50'] }]}
    >
      <Stack.Screen options={{ title: 'My Orders' }} />
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={!isOrdersFetching ? ListEmptyComponent : null}
        refreshControl={
          <RefreshControl
            refreshing={isOrdersFetching}
            onRefresh={refetchOrders}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

// ... (renderOrderItem, ListEmptyComponent, and styles remain the same)
const renderOrderItem = ({ item }: { item: Order }) => (
  <OrderCard
    order={item}
    // onPress={() => router.navigate(`/(order)/${item.id}`)}
  />
);

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
  listContentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 20,
  },
});

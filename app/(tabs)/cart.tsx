import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

import { selectIsAuthenticated } from '@/redux/slices/authSlice';
import {
  useGetMyCartQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} from '@/redux/api/cartApi';
import CartItemCard from '@/components/cart/CartItemCard';
import { useColorTheme } from '@/hooks/useColorTheme';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';
import { CartItem } from '@/types/cart';
import LoadingError from '@/components/ui/LoadingError';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

export default function CartScreen() {
  const colors = useColorTheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null); // To show loading on specific item

  const {
    data: cartResponse,
    error: cartError,
    isLoading: isCartLoading,
    isFetching: isCartFetching,
    refetch: refetchCart,
  } = useGetMyCartQuery(undefined, { skip: !isAuthenticated });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  const cart = cartResponse?.data?.data;
  const cartItems = cart?.CartItems || [];

  // console.log('Cart:', cart);

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    const item = cartItems.find((ci) => ci.id === itemId);
    if (!item || newQuantity < 1) return;
    // Optional: Check against product stock if item.Product.stock is available
    if (item.Product && newQuantity > item.Product.stock) {
      Toast.show({
        type: 'info',
        text1: 'Stock Limit Reached',
        text2: `Only ${item.Product.stock} available.`,
      });
      return;
    }

    setUpdatingItemId(itemId);
    try {
      await updateCartItem({
        itemId,
        body: { quantity: newQuantity },
      }).unwrap();
      // Refetch or optimistic update handles UI. Toast for success is optional.
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Could not update item quantity.',
      });
      console.error('Update quantity error:', err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    console.log('Attempting to remove item with ID:', itemId);
    setUpdatingItemId(itemId);
    try {
      // Since the mutation is now typed as Promise<void> from unwrap()
      await deleteCartItem(itemId).unwrap(); // This will resolve with 'undefined' on success (204)
      Toast.show({
        type: 'success',
        text1: 'Item Removed',
        text2: 'The item has been removed from your cart.',
      });
      // The invalidatesTags will trigger a refetch of getMyCart
    } catch (err) {
      // This catch block will now only be hit for actual network errors or non-2xx HTTP statuses
      Toast.show({
        type: 'error',
        text1: 'Remove Failed',
        text2: 'Could not remove item from cart.',
      });
      console.error('Remove item error:', err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <CartItemCard
      item={item}
      onIncreaseQuantity={() =>
        handleQuantityUpdate(item.id, item.quantity + 1)
      }
      onDecreaseQuantity={() =>
        handleQuantityUpdate(item.id, item.quantity - 1)
      }
      onRemoveItem={() => handleRemoveItem(item.id)}
      isUpdating={updatingItemId === item.id}
    />
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyCartContainer}>
      <Text style={[styles.emptyCartText, { color: colors['gray-700'] }]}>
        Your cart is empty.
      </Text>
      <Button
        title='Start Shopping'
        onPress={() => router.push('/(tabs)/home')}
        style={{ marginTop: 20, width: '60%' }}
      />
    </View>
  );

  if (!isAuthenticated && !isCartLoading) {
    // Check isCartLoading to prevent flash during initial auth check
    // This useEffect was removed as the conditional render handles it.
    // If you prefer useEffect for navigation, ensure it's correctly placed and dependencies are right.
    // For now, direct conditional rendering is simpler.
    if (typeof window !== 'undefined') {
      // Ensure router is only called on client
      router.replace({
        pathname: '/(auth)/signin',
        params: { redirect: '/(tabs)/cart' },
      });
      Toast.show({
        type: 'info',
        text1: 'Please Sign In',
        text2: 'You need to be logged in to view your cart.',
        visibilityTime: 3000,
      });
    }
    return <LoadingIndicator message='Redirecting to sign in...' />;
  }

  if (isCartLoading && !cartItems.length) {
    return <LoadingIndicator message='Loading cart...' />;
  }

  if (cartError) {
    const errorMessage =
      (cartError as any)?.data?.message || 'Failed to load your cart.';
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <LoadingError message={errorMessage} onRetry={refetchCart} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors['gray-50'] }]}
    >
      <Stack.Screen options={{ title: 'My Cart' }} />
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          !isCartFetching && isAuthenticated ? ListEmptyComponent : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isCartFetching && isAuthenticated}
            onRefresh={refetchCart}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      {isAuthenticated && cartItems.length > 0 && (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors['gray-200'],
              backgroundColor: colors.background,
            },
          ]}
        >
          <View style={styles.totalContainer}>
            <Text style={[styles.totalLabel, { color: colors['gray-700'] }]}>
              Total:
            </Text>
            <Text style={[styles.totalPrice, { color: colors.primary }]}>
              {formatPrice(cart?.total_price || 0)}
            </Text>
          </View>
          <Button
            title='Proceed to Checkout'
            onPress={() => {
              Toast.show({
                type: 'info',
                text1: 'To be implemented: Checkout',
              });
            }}
            style={styles.checkoutButton}
            disabled={!!updatingItemId} // Disable checkout if any item action is in progress
          />
        </View>
      )}
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
  listContentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexGrow: 1,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  checkoutButton: {},
});

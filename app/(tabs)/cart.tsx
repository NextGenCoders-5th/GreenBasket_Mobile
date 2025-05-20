// app/(tabs)/cart.tsx
import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import Toast from 'react-native-toast-message';

import {
  useGetMyCartQuery /*, useUpdateCartItemMutation, useRemoveCartItemMutation */,
} from '@/redux/api/cartApi'; // Assuming you'll add these mutations
import CartItemCard from '@/components/cart/CartItemCard';
import { useColorTheme } from '@/hooks/useColorTheme';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';
import { CartItem } from '@/types/cart';
import { useAuth } from '@/hooks/useAuth';
import LoadingError from '@/components/ui/LoadingError';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import TextButton from '@/components/ui/TextButton';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/slices/authSlice';
import SignIn from '@/components/account/SignIn';

export default function CartScreen() {
  const colors = useColorTheme();
  const user = useSelector(selectCurrentUser);

  const {
    data: cartResponse,
    error: cartError,
    isLoading: isCartLoading,
    isFetching: isCartFetching,
    refetch: refetchCart,
  } = useGetMyCartQuery();

  // Placeholder mutations - you'll need to implement these in cartApi.ts
  // const [updateCartItem, { isLoading: isUpdatingQuantity }] = useUpdateCartItemMutation();
  // const [removeCartItem, { isLoading: isRemovingItem }] = useRemoveCartItemMutation();

  const cart = cartResponse?.data?.data;
  const cartItems = cart?.CartItems || [];

  // console.log('user', user);
  // console.log('Cart', cart);
  // console.log('Cart Items', cartItems);

  // if (cartItems.length > 0) {
  //   console.log('RAW Cart Items from API:', JSON.stringify(cartItems, null, 2));
  //   // Specifically log the 'product' field of the first item
  //   console.log(
  //     'First Cart Item RAW Product Field:',
  //     JSON.stringify(cartItems[0]?.Product, null, 2)
  //   );
  // }

  const handleIncreaseQuantity = useCallback(
    async (itemId: string) => {
      const item = cartItems.find((ci) => ci.id === itemId);
      if (!item) return;
      console.log(
        'Increase quantity for item:',
        itemId,
        'Current:',
        item.quantity
      );
      // await updateCartItem({ itemId, quantity: item.quantity + 1 }).unwrap();
      Toast.show({
        type: 'info',
        text1: 'To be implemented: Increase Quantity',
      });
    },
    [cartItems /*, updateCartItem */]
  );

  const handleDecreaseQuantity = useCallback(
    async (itemId: string) => {
      const item = cartItems.find((ci) => ci.id === itemId);
      if (!item || item.quantity <= 1) return;
      console.log(
        'Decrease quantity for item:',
        itemId,
        'Current:',
        item.quantity
      );
      // await updateCartItem({ itemId, quantity: item.quantity - 1 }).unwrap();
      Toast.show({
        type: 'info',
        text1: 'To be implemented: Decrease Quantity',
      });
    },
    [cartItems /*, updateCartItem */]
  );

  const handleRemoveItem = useCallback(
    async (itemId: string) => {
      console.log('Remove item:', itemId);
      // await removeCartItem(itemId).unwrap();
      Toast.show({ type: 'success', text1: 'To be implemented: Item Removed' });
    },
    [
      /* removeCartItem */
    ]
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <CartItemCard
      item={item}
      onIncreaseQuantity={handleIncreaseQuantity}
      onDecreaseQuantity={handleDecreaseQuantity}
      onRemoveItem={handleRemoveItem}
    />
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyCartContainer}>
      <Text style={[styles.emptyCartText, { color: colors['gray-700'] }]}>
        Your cart is empty.
      </Text>
      <Button
        title='Start Shopping'
        onPress={() => router.push('/(tabs)/home')} // Navigate to home or products tab
        style={{ marginTop: 20, width: '60%' }}
      />
    </View>
  );

  if (!user) return <SignIn />;

  if (user && !cart) {
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Inter',
            color: colors['gray-700'],
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          There is no acitve cart. Head over and add to your cart.
        </Text>
        <TextButton
          title='Continue shopping'
          onPress={() => {
            router.navigate('/(tabs)/home'); // Navigate to create cart screen
          }}
        />
      </SafeAreaView>
    );
  }

  if (isCartLoading) {
    return <LoadingIndicator message='Loading carts...' />;
  }

  if (cartError) {
    console.error('Error fetching cart:', cartError);
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
        ListEmptyComponent={!isCartFetching ? ListEmptyComponent : null} // Show empty only when not fetching
        refreshControl={
          <RefreshControl
            refreshing={isCartFetching}
            onRefresh={refetchCart}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      {cartItems.length > 0 && (
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
              // router.push('/checkout'); // Navigate to checkout screen
              Toast.show({
                type: 'info',
                text1: 'To be implemented: Checkout',
              });
            }}
            style={styles.checkoutButton}
            // disabled={isUpdatingQuantity || isRemovingItem} // If you implement these
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
    flexGrow: 1, // Important for ListEmptyComponent to center
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    // backgroundColor is set dynamically
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
  checkoutButton: {
    // Button component handles its own styling
  },
});

// app/(order)/place-order.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

import { useColorTheme } from '@/hooks/useColorTheme';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';
import { useGetMyCartQuery } from '@/redux/api/cartApi';
import { useCreateOrderMutation } from '@/redux/api/orderApi'; // Import createOrder mutation
import { selectIsAuthenticated } from '@/redux/slices/authSlice'; // Only need isAuthenticated here
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import CartItemReviewCard from '@/components/cart/CartItemReviewCard';
import { useCurrentUser } from '@/hooks/useCurrentUser'; // <-- Import useCurrentUser
import TextButton from '@/components/ui/TextButton';
import { UserVerifyStatus } from '@/config/enums';

// Assuming tax is a fixed percentage for simplicity, or calculated on backend
const ESTIMATED_TAX_RATE = 0.05; // 5% example

export default function PlaceOrderScreen() {
  const colors = useColorTheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const {
    user,
    isLoading: isUserLoading,
    error: userError,
    refetchCurrentUser,
  } = useCurrentUser(); // <-- Use useCurrentUser
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);

  // console.log('User', user);

  // Fetch cart data for review
  const {
    data: cartResponse,
    error: cartError,
    isLoading: isCartLoading,
    isFetching: isCartFetching,
    refetch: refetchCart,
  } = useGetMyCartQuery(undefined, { skip: !isAuthenticated });

  // Mutation to create the order
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  const cart = cartResponse?.data?.data;
  const cartItems = cart?.CartItems || [];
  const shippingAddress = user?.address; // Get address from the user object fetched by useCurrentUser

  const subtotal = cart?.total_price || 0;
  const estimatedTax = subtotal * ESTIMATED_TAX_RATE;
  const totalIncludingTax = subtotal + estimatedTax;

  // Handle cases where user is not authenticated or user object is missing/error
  useEffect(() => {
    // Wait until user loading is complete
    if (!isAuthenticated && !isUserLoading) {
      Toast.show({
        type: 'info',
        text1: 'Please Sign In',
        text2: 'You need to be logged in to place an order.',
        visibilityTime: 3000,
      });
      router.replace('/(auth)/signin');
    }
    // Optionally handle userError: if userError and !user, maybe redirect?
    if (userError && !user && !isUserLoading) {
      // console.error('Error fetching user for checkout:', userError);
      Toast.show({
        type: 'error',
        text1: 'Error Loading User',
        text2: 'Could not load your profile information.',
        visibilityTime: 3000,
      });
      // Depending on severity, you might redirect or just show the error
      // router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, user, isUserLoading, userError, router]);

  const handleConfirmOrder = async () => {
    if (!shippingAddress) {
      Toast.show({
        type: 'error',
        text1: 'Shipping Address Required',
        text2: 'Please add a shipping address to proceed.',
      });
      // Navigate to add address screen if user has no address
      router.push('/(profile)/addresses'); // Link to address list where they can add/edit
      return;
    }

    if (!cart || cartItems.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Cart is Empty',
        text2: 'Please add items to your cart before placing an order.',
      });
      router.replace('/(tabs)/cart');
      return;
    }

    setIsConfirmingOrder(true);
    try {
      Toast.show({
        type: 'info',
        text1: 'Creating Order...',
      });

      const result = await createOrder({
        addressId: shippingAddress.id,
        cartId: cart.id,
      }).unwrap();

      // console.log('Order creation result:', result);

      // Adjusted access based on CreateOrderResponse = ApiResponse<Order[]>
      const newOrders = (result as any)?.data?.data;

      if (newOrders && newOrders.length > 0 && newOrders[0]?.id) {
        const newOrderId = newOrders[0].id; // Assuming the first order in the array is the main one

        Toast.show({
          type: 'success',
          text1: 'Order Created',
          text2: `Order #${newOrderId} has been created.`,
        });
        router.push({
          pathname: '/(order)/[orderId]',
          params: { orderId: newOrderId },
        });
      } else {
        // console.error('Unexpected order creation response structure:', result);
        Toast.show({
          type: 'error',
          text1: 'Order Creation Failed',
          text2: 'Unexpected response from server or order ID missing.',
        });
      }
    } catch (err: any) {
      // console.error('Failed to create order:', err);
      const message = err?.data?.message || 'Could not create order.';
      Toast.show({
        type: 'error',
        text1: 'Order Creation Failed',
        text2: message,
      });
    } finally {
      setIsConfirmingOrder(false);
    }
  };

  // Combine loading states for cart AND user data
  if (isCartLoading || isCartFetching || isUserLoading) {
    return <LoadingIndicator message='Preparing checkout...' />;
  }

  if (cartError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
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
  }

  // Handle errors for cart AND user data
  if (cartError || userError) {
    const errorMessage =
      (cartError as any)?.data?.message ||
      (userError as any)?.data?.message ||
      'Failed to load checkout information.';
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <LoadingError
          message={errorMessage}
          onRetry={() => {
            refetchCart();
            refetchCurrentUser();
          }}
        />
      </SafeAreaView>
    );
  }

  // Handle cases after loading where user is still null (should be caught by useEffect redirect, but safety)
  if (!user) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.emptyCartText, { color: colors['gray-700'] }]}>
          User not loaded.
        </Text>
        {/* Maybe show a sign-in prompt here or rely solely on useEffect redirect */}
      </SafeAreaView>
    );
  }

  // Handle empty cart specifically after loading and user is available
  if (!cart || cartItems.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.emptyCartText, { color: colors['gray-700'] }]}>
          Your cart is empty. Add items to checkout.
        </Text>
        <Button
          title='Start Shopping'
          onPress={() => router.replace('/(tabs)/home')}
          style={{ marginTop: 20, width: '60%' }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors['gray-50'] }]}
    >
      <Stack.Screen options={{ title: 'Place Order' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cart Review Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>
            Order Summary
          </Text>
          {cartItems.map((item) => (
            <CartItemReviewCard key={item.id} item={item} />
          ))}
        </View>

        {/* Shipping Address Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>
            Shipping Address
          </Text>
          {shippingAddress ? (
            <View
              style={[
                styles.addressContainer,
                {
                  borderColor: colors['gray-300'],
                  backgroundColor: colors.background,
                },
              ]}
            >
              <Text style={[styles.addressText, { color: colors['gray-700'] }]}>
                {shippingAddress.street}
              </Text>
              <Text
                style={[styles.addressText, { color: colors['gray-700'] }]}
              >{`${shippingAddress.sub_city}, ${shippingAddress.city}, ${shippingAddress.country}`}</Text>

              <Button
                title='Edit Address'
                onPress={() => router.push('/(address)/edit')}
                style={{ marginTop: 10 }}
                // variant='outline'
              />
            </View>
          ) : (
            <View
              style={[
                styles.addressContainer,
                styles.noAddress,
                {
                  borderColor: colors['gray-300'],
                  backgroundColor: colors.background,
                },
              ]}
            >
              <Text style={[styles.addressText, { color: colors.red }]}>
                No shipping address found.
              </Text>
              <Button
                title='Add Shipping Address'
                onPress={() => router.push('/(address)/create')}
                style={{ marginTop: 10 }}
              />
            </View>
          )}
        </View>

        {/* Price Summary Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>
            Price Details
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors['gray-700'] }]}>
              Subtotal:
            </Text>
            <Text style={[styles.priceValue, { color: colors['gray-800'] }]}>
              {formatPrice(subtotal)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors['gray-700'] }]}>
              Tax ({ESTIMATED_TAX_RATE * 100}%):
            </Text>
            <Text style={[styles.priceValue, { color: colors['gray-800'] }]}>
              {formatPrice(estimatedTax)}
            </Text>
          </View>
          <View
            style={[
              styles.priceRow,
              styles.totalPriceRow,
              { borderTopColor: colors['gray-200'] },
            ]}
          >
            <Text
              style={[
                styles.priceLabel,
                styles.totalLabel,
                { color: colors['gray-900'] },
              ]}
            >
              Total:
            </Text>
            <Text
              style={[
                styles.priceValue,
                styles.totalValue,
                { color: colors.primary },
              ]}
            >
              {formatPrice(totalIncludingTax)}
            </Text>
          </View>
        </View>

        {/* Footer with Confirm Order Button */}
        <View
          style={[
            styles.footer,

            {
              // borderTopColor: colors['gray-200'],
              // backgroundColor: colors.background,
              borderWidth: 0,
            },
          ]}
        >
          {user.is_onboarding ? (
            <View style={styles.completeProfileContainer}>
              <Text style={{ ...styles.text, color: colors['gray-600'] }}>
                Your profile is not complete.
              </Text>
              <TextButton
                title='Click here'
                onPress={() => router.push('/(profile)/complete-onboarding')}
                style={styles.signupButton}
                titleStyle={{
                  ...styles.signupTitle,
                  color: colors.primary,
                  textDecorationColor: colors.primary,
                }}
              />
              <Text style={{ ...styles.text, color: colors['gray-600'] }}>
                to complete.
              </Text>
            </View>
          ) : null}

          {/* <View style={styles.completeProfileContainer}>
            {user.verify_status === UserVerifyStatus.REQUESTED ? (
              <Text style={{ ...styles.text, color: colors['gray-600'] }}>
                Your account verification is requested please wait until
                verified.
              </Text>
            ) : null}
          </View>
          {user.verify_status === UserVerifyStatus.DECLINED ? (
            <View style={styles.completeProfileContainer}>
              <Text style={{ ...styles.text, color: colors['gray-600'] }}>
                Your account verification is declined please provide valid
                infomration.
              </Text>
            </View>
          ) : null} */}

          <Button
            title={
              user.verify_status === UserVerifyStatus.VERIFIED
                ? 'Confirm Order'
                : 'verify your account'
            }
            onPress={handleConfirmOrder}
            isLoading={isConfirmingOrder || isCreatingOrder}
            style={styles.confirmButton}
            // Disable if no address, empty cart, or currently loading cart/user data
            disabled={
              !shippingAddress ||
              !cartItems.length ||
              isCartLoading ||
              isUserLoading ||
              user.is_onboarding ||
              user.verify_status !== UserVerifyStatus.VERIFIED
            }
          />
        </View>
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
  emptyCartText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 15,
  },
  addressContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
  },
  noAddress: {
    borderColor: 'red',
  },
  addressText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  priceValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  totalPriceRow: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    gap: 20,
    alignSelf: 'center',
    width: '100%',
  },
  confirmButton: {},
  completeProfileContainer: {
    width: '100%',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  signupButton: {
    paddingVertical: 0,
    paddingHorizontal: 2,
    margin: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  signupTitle: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useColorTheme } from '@/hooks/useColorTheme';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';
import { useGetMyOrderByIdQuery } from '@/redux/api/orderApi'; // Import order query
import { useInitializeChapaPaymentMutation } from '@/redux/api/paymentApi'; // Import payment mutation
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import { OrderStatus } from '@/config/enums';
import { OrderItem } from '@/types/order'; // Import OrderItem type
import { useCurrentUser } from '@/hooks/useCurrentUser'; // Import useCurrentUser
import OrderItemReviewCard from '@/components/order/OrderItemReviewCard';

export default function OrderSummaryScreen() {
  const colors = useColorTheme();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  // Use useCurrentUser if you need user details on this screen for any reason,
  // though primary focus here is order details fetched separately.
  // const { user, isLoading: isUserLoading, error: userError } = useCurrentUser();

  // Fetch the specific order details with polling
  const {
    data: orderResponse,
    error: orderError,
    isLoading: isOrderLoading,
    isFetching: isOrderFetching,
    refetch: refetchOrder,
  } = useGetMyOrderByIdQuery(orderId!, {
    skip: !orderId, // Skip if orderId is not available
  });

  // Mutation to initiate payment for this order
  const [initiatePayment, { isLoading: isInitiatingPayment }] =
    useInitializeChapaPaymentMutation();

  const order = orderResponse?.data?.data;
  const orderItems = order?.OrderItems || [];
  const shippingAddress = order?.Adress; // Address is nested under Adress in your type

  // Stop polling when order status is no longer pending
  useEffect(() => {
    if (order?.status !== OrderStatus.PENDING) {
      // You would typically use a control object from the query hook
      // if it provided a stopPolling function.
      // As a simpler alternative without a dedicated stopPolling function from RTK Query hook:
      // The `pollingInterval` being set to 0 when status changes can handle this
      // or you rely on the component unmounting to stop polling.
      // console.log(`Order ${orderId} status is now ${order?.status}, stopping polling.`);
    }
  }, [order?.status]); // Dependency on order status

  // Handle case where orderId is missing (shouldn't happen with router.replace)
  useEffect(() => {
    if (!orderId) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Order',
        text2: 'Order ID is missing.',
      });
      router.replace('/(tabs)/home'); // Redirect if orderId is missing
    }
  }, [orderId, router]);

  const handleContinuePayment = async () => {
    if (!orderId) {
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: 'Cannot initiate payment without an Order ID.',
      });
      return;
    }

    if (order?.status !== OrderStatus.PENDING) {
      Toast.show({
        type: 'info',
        text1: 'Order Status',
        text2: `Order is not in a pending state (${order?.status}). Cannot initiate payment.`,
      });
      return;
    }

    try {
      Toast.show({
        type: 'info',
        text1: 'Initiating Payment...',
      });

      // Call the initializeChapaPayment mutation with the orderId
      const result = await initiatePayment({ orderId }).unwrap();

      console.log('Payment initiation result:', result);

      // Access the checkout_url based on your InitializePaymentResponse type
      const chapaPaymentUrl = result?.data?.data?.checkout_url;

      if (chapaPaymentUrl) {
        Toast.show({
          type: 'info',
          text1: 'Redirecting to Payment',
          text2: 'Please complete the payment in your browser.',
        });
        // Open the Chapa payment URL
        await Linking.openURL(chapaPaymentUrl);
        // After opening URL, the polling should help update the status eventually.
        // If you need faster feedback, you could manually refetch after a short delay.
        // setTimeout(() => refetchOrder(), 2000);
      } else {
        console.error(
          'Chapa checkout URL missing from initiation response:',
          result
        );
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: 'Could not get payment link from server.',
        });
      }
    } catch (err: any) {
      console.error('Failed to initiate payment:', err);
      const message = err?.data?.message || 'Could not initiate payment.';
      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2: message,
      });
    }
  };

  // Handle loading state for order data (and user if used)
  if (!orderId || isOrderLoading || isOrderFetching /* || isUserLoading */) {
    return <LoadingIndicator message='Loading order details...' />;
  }

  // Handle errors for order data (and user if used)
  if (orderError /* || userError */) {
    const errorMessage =
      (orderError as any)?.data
        ?.message /* || (userError as any)?.data?.message */ ||
      'Failed to load order details.';
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        {/* Retry logic: refetchOrder and potentially refetchCurrentUser() */}
        <LoadingError message={errorMessage} onRetry={refetchOrder} />
      </SafeAreaView>
    );
  }

  // Handle case where order is not found (e.g., 404 error)
  if (!order) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.emptyCartText, { color: colors['gray-700'] }]}>
          Order not found.
        </Text>
        <Button
          title='Go to Orders'
          onPress={() => router.replace('/(order)/')} // Navigate to order history
          style={{ marginTop: 20, width: '60%' }}
        />
      </SafeAreaView>
    );
  }

  // Calculate price summary for the order
  const orderSubtotal = order.total_price;
  const ESTIMATED_TAX_RATE = 0.05; // Ensure consistency if used elsewhere
  const orderEstimatedTax = orderSubtotal * ESTIMATED_TAX_RATE;
  const orderTotalIncludingTax = orderSubtotal + orderEstimatedTax;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors['gray-50'] }]}
    >
      {/* <Stack.Screen options={{ title: `Order #${order.id}` }} /> */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Status */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>
            Order Status
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status, colors) },
            ]}
          >
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Order Items Review Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>
            Items
          </Text>
          {orderItems.map((item: OrderItem) => (
            // Ensure Product is available or handle null gracefully in CartItemReviewCard
            <OrderItemReviewCard
              key={item.id}
              item={{ ...item, Product: item.Product! }}
            /> // Cast item
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
              <Text style={[styles.addressText, { color: colors['gray-700'] }]}>
                Zip: {shippingAddress.zip_code}
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.addressContainer,
                {
                  borderColor: colors['gray-300'],
                  backgroundColor: colors.background,
                },
              ]}
            >
              <Text style={[styles.addressText, { color: colors['gray-600'] }]}>
                Shipping address not available for this order.
              </Text>
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
              {formatPrice(orderSubtotal)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors['gray-700'] }]}>
              Tax ({ESTIMATED_TAX_RATE * 100}%):
            </Text>
            <Text style={[styles.priceValue, { color: colors['gray-800'] }]}>
              {formatPrice(orderEstimatedTax)}
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
              {formatPrice(orderTotalIncludingTax)}
            </Text>
          </View>
        </View>

        {/* Payment Information (Optional) */}
        {/* You could add a section here showing payment method if recorded, or payment status details */}
      </ScrollView>

      {/* Footer with Payment Button */}
      {/* Only show payment button if order is pending */}
      {order?.status === OrderStatus.PENDING && (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors['gray-200'],
              backgroundColor: colors.background,
            },
          ]}
        >
          <Button
            title='Continue to Payment'
            onPress={handleContinuePayment}
            isLoading={isInitiatingPayment}
            style={styles.paymentButton}
          />
        </View>
      )}

      {/* Optionally show a message if payment is processing after redirect */}
      {order?.status === OrderStatus.PENDING && isOrderFetching && (
        <View
          style={[
            styles.processingOverlay,
            { backgroundColor: colors.background + 'b0' },
          ]}
        >
          <ActivityIndicator size='large' color={colors.primary} />
          <Text style={[styles.processingText, { color: colors['gray-700'] }]}>
            Processing payment...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// Helper function to get status badge color (customize as needed)
function getStatusColor(status: OrderStatus, colors: any) {
  switch (status) {
    case OrderStatus.PENDING:
      return colors.warning;
    case OrderStatus.CONFIRMED:
      return colors.success;
    case OrderStatus.SHIPPED:
    case OrderStatus.DELIVERED:
    case OrderStatus.RETURNED:
      return colors.info;
    case OrderStatus.CANCELLED:
      return colors.red;
    default:
      return colors['gray-500'];
  }
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
    // Reused style for order not found
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
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    textTransform: 'uppercase',
  },
  addressContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
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
  },
  paymentButton: {},
  processingOverlay: {
    // New style for payment processing overlay
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    // New style for processing text
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});

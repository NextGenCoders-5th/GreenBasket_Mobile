// app/(order)/[orderId].tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useColorTheme } from '@/hooks/useColorTheme';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';
import { useGetMyOrderByIdQuery } from '@/redux/api/orderApi';
import { useInitializeChapaPaymentMutation } from '@/redux/api/paymentApi';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
// Use the updated OrderStatus enum
import { OrderStatus } from '@/config/enums';
import OrderItemReviewCard from '@/components/order/OrderItemReviewCard';
import { OrderItem } from '@/types/order';
import ImageButton from '@/components/ui/ImageButton';
// useCurrentUser is not needed if only showing order data
// import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function OrderSummaryScreen() {
  const colors = useColorTheme();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  // Fetch the specific order details with polling
  const {
    data: orderResponse,
    error: orderError,
    isLoading: isOrderLoading,
    isFetching: isOrderFetching,
    refetch: refetchOrder,
    // pollingInterval: 5000, // Poll every 5 seconds while component is mounted and query is active
    // refetchOnMountOrArgChange: true,
    // refetchOnReconnect: true,
  } = useGetMyOrderByIdQuery(orderId);

  // Mutation to initiate payment for this order
  const [initiatePayment, { isLoading: isInitiatingPayment }] =
    useInitializeChapaPaymentMutation();

  const order = orderResponse?.data?.data;
  const orderItems = order?.OrderItems || [];

  // Stop polling when order status is no longer PENDING
  useEffect(() => {
    if (order?.status !== OrderStatus.PENDING) {
      // console.log(
      //   `Order ${orderId} status is now ${order?.status}, stopping proactive polling check.`
      // );
    }
    // This dependency on order?.status helps trigger this effect when the status changes
  }, [order?.status]);

  // Handle case where orderId is missing (shouldn't happen with router.replace)
  useEffect(() => {
    if (!orderId) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Order',
        text2: 'Order ID is missing.',
      });
      router.replace('/(tabs)/home');
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

    // Use the updated OrderStatus enum
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

      const result = await initiatePayment({ orderId }).unwrap();

      // console.log('Payment initiation result:', result);

      const chapaPaymentUrl = (result as any)?.data?.data?.checkout_url;

      if (chapaPaymentUrl) {
        Toast.show({
          type: 'info',
          text1: 'Redirecting to Payment',
          text2: 'Please complete the payment in your browser.',
        });
        await Linking.openURL(chapaPaymentUrl);
      } else {
        // console.error(
        //   'Chapa checkout URL missing from initiation response:',
        //   result
        // );
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: 'Could not get payment link from server.',
        });
      }
    } catch (err: any) {
      // console.error('Failed to initiate payment:', err);
      const message = err?.data?.message || 'Could not initiate payment.';
      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2: message,
      });
    }
  };

  if (!orderId || isOrderLoading || isOrderFetching) {
    return <LoadingIndicator message='Loading order details...' />;
  }

  if (orderError) {
    const errorMessage =
      (orderError as any)?.data?.message || 'Failed to load order details.';
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <LoadingError message={errorMessage} onRetry={refetchOrder} />
      </SafeAreaView>
    );
  }

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
          onPress={() => router.replace('/(order)/')}
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
      <Stack.Screen options={{ title: `Order #${order.id}` }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>
            Items
          </Text>
          {orderItems.map((item: OrderItem) => (
            // Use OrderItemReviewCard here
            <OrderItemReviewCard key={item.id} item={item} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>
            Price Details
          </Text>
          <View
            style={[
              styles.priceRow,
              styles.totalPriceRow,
              {
                borderTopColor: colors['gray-200'],
                borderTopWidth: 0,
                marginTop: 0,
                paddingTop: 0,
              },
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
              {orderTotalIncludingTax
                ? formatPrice(orderTotalIncludingTax)
                : null}
            </Text>
          </View>
        </View>
      </ScrollView>

      {order?.status === OrderStatus.PENDING ? (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors['gray-200'],
              backgroundColor: colors.background,
            },
          ]}
        >
          <Image
            source={require('@/assets/images/chapa.png')}
            style={{
              width: '100%',
              height: 60,
              marginBottom: 10,
              resizeMode: 'cover',
            }}
          />
          <Button
            title='Continue to Payment'
            onPress={handleContinuePayment}
            isLoading={isInitiatingPayment}
            style={styles.paymentButton}
          />
        </View>
      ) : null}

      {order?.status === OrderStatus.PENDING &&
      isOrderFetching &&
      !isInitiatingPayment ? (
        <View
          style={[
            styles.processingOverlay,
            { backgroundColor: colors.background + 'b0' },
          ]}
        >
          <ActivityIndicator size='large' color={colors.primary} />
          <Text style={[styles.processingText, { color: colors['gray-700'] }]}>
            Checking payment status...
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

// Helper function to get status badge color (customize as needed)
// Use the updated OrderStatus enum values
function getStatusColor(status: OrderStatus, colors: any) {
  switch (status) {
    case OrderStatus.PENDING:
      return colors.warning;
    case OrderStatus.CONFIRMED: // Added confirmed status color
      return colors.info; // Example: use info color
    case OrderStatus.SHIPPED:
      return colors.primary; // Example: green for shipped
    case OrderStatus.DELIVERED:
      return colors.success; // Example: success for delivered
    case OrderStatus.CANCELLED:
    case OrderStatus.RETURNED: // Added returned status color
      return colors.red;
    default:
      return colors['gray-500']; // Default color
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
    // Kept styles, although section is removed from display
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
  },
  addressText: {
    // Kept styles, although section is removed from display
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
    // Adjusted styles for only total
    // Removed borderTopWidth, marginTop, paddingTop if showing only total in its own view
    // If integrating directly after items, keep borderTop and padding
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 0, // Adjust spacing
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});

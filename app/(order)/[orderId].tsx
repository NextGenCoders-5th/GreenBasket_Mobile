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
  } = useGetMyOrderByIdQuery(orderId!, {
    skip: !orderId,
  });

  // Mutation to initiate payment for this order
  const [initiatePayment, { isLoading: isInitiatingPayment }] =
    useInitializeChapaPaymentMutation();

  const order = orderResponse?.data?.data;
  const orderItems = order?.OrderItems || [];

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
        // After opening URL, manually refetch the order to check status update
        // Polling is also active, but a manual refetch can sometimes provide faster initial update
        setTimeout(() => {
          refetchOrder(); // Refetch after a short delay to allow backend webhook processing
          Toast.show({
            // Optional feedback
            type: 'info',
            text1: 'Checking Payment Status...',
            visibilityTime: 2000,
          });
        }, 2000); // Adjust delay if needed
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

  // Handle loading state for order data
  if (!orderId || isOrderLoading || isOrderFetching) {
    return <LoadingIndicator message='Loading order details...' />;
  }

  // Handle errors for order data
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

  // Handle case where order is not found (e.g., 404 error after loading)
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
      <View
        style={[
          styles.priceRow,
          {
            borderTopColor: colors['gray-200'],
          },
        ]}
      >
        <Text style={[styles.totalLabel, { color: colors['gray-800'] }]}>
          Total Price:
        </Text>
        <Text style={[styles.totalValue, { color: colors.primary }]}>
          {formatPrice(orderTotalIncludingTax)}
        </Text>
      </View>

      {/* Only show payment button if order is PENDING */}
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
          <Image
            source={require('@/assets/images/chapa.png')}
            style={{
              width: 200,
              height: 50,
            }}
          />
          <Button
            title='Continue Payment with Chapa'
            onPress={handleContinuePayment}
            isLoading={isInitiatingPayment}
            style={styles.paymentButton}
            titleStyle={{
              fontSize: 20,
              fontFamily: 'Inter-Medium',
              fontWeight: '700',
            }}
          />
        </View>
      )}

      {/* Optionally show a message if payment is processing after redirect */}
      {/* Only show if status is still pending but a fetch is happening */}
      {order?.status === OrderStatus.PENDING &&
        isOrderFetching &&
        !isInitiatingPayment && (
          <View
            style={[
              styles.processingOverlay,
              { backgroundColor: colors.background + 'b0' },
            ]}
          >
            <ActivityIndicator size='large' color={colors.primary} />
            <Text
              style={[styles.processingText, { color: colors['gray-700'] }]}
            >
              Checking payment status...
            </Text>
          </View>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 10,
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

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  paymentButton: {
    paddingVertical: 15,
  },
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

import { apiSlice } from './apiSlice';
import {
  InitializePaymentDto,
  InitializePaymentResponse,
} from '@/types/payment';

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initializeChapaPayment: builder.mutation<
      InitializePaymentResponse,
      InitializePaymentDto
    >({
      query: (paymentData) => ({
        url: '/payments/initialize',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: (result, error, args) => {
        const tags = [];
        if (args.orderId) {
          // Invalidate the specific order details query
          tags.push({ type: 'Order' as const, id: args.orderId });
          // Invalidate the getMyOrders list query
          tags.push({ type: 'Order' as const, id: 'LIST' });
        }
        return tags;
      },
    }),
  }),
  // Use overrideExisting: true if this slice is injected after others
  overrideExisting: true,
});

export const { useInitializeChapaPaymentMutation } = paymentApi;

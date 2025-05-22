import { apiSlice } from './apiSlice';
import {
  InitializePaymentDto,
  InitializePaymentResponse,
} from '@/types/payment';

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/payments/chapa/initialize - Initialize payment with Chapa
    initializeChapaPayment: builder.mutation<
      InitializePaymentResponse,
      InitializePaymentDto
    >({
      query: (paymentData) => ({
        url: '/payments/chapa/initialize',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: (result, error, args) =>
        args.orderId ? [{ type: 'Order', id: args.orderId }] : [],
    }),
  }),
});

export const { useInitializeChapaPaymentMutation } = paymentApi;

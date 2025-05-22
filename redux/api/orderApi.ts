import { apiSlice } from './apiSlice';
import {
  CheckoutDto,
  CreateOrderResponse,
  GetMyOrdersResponse,
  GetMyOrderByIdResponse,
} from '@/types/order';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CheckoutDto>({
      query: (checkoutData) => ({
        url: '/orders/checkout',
        method: 'POST',
        body: checkoutData,
      }),
      invalidatesTags: ['Cart', 'Order'],
    }),

    getMyOrders: builder.query<GetMyOrdersResponse, void>({
      query: () => '/orders/my-orders',
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(
                ({ id }) => ({ type: 'Order' as const, id } as const)
              ),
              { type: 'Order' as const, id: 'LIST' },
            ]
          : [{ type: 'Order' as const, id: 'LIST' }],
    }),

    getMyOrderById: builder.query<GetMyOrderByIdResponse, string>({
      query: (orderId) => `/orders/my-orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: 'Order' as const, id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetMyOrderByIdQuery,
} = orderApi;

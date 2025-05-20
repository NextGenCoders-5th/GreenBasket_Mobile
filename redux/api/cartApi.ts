import { apiSlice } from '@/redux/api/apiSlice';
import {
  CreateCartItemDto,
  CreateCartItemResponse,
  GetMyCartResponse,
} from '@/types/cart'; // Adjust path as needed

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/cart/my-cart - Get my cart
    getMyCart: builder.query<GetMyCartResponse, void>({
      query: () => '/cart/my-cart',
      providesTags: (result) =>
        result && result.data.data
          ? [{ type: 'Cart' as const, id: result.data.data.id }]
          : ['Cart'],
    }),

    // POST /api/v1/cart-items - Create a new cart item
    createCartItem: builder.mutation<CreateCartItemResponse, CreateCartItemDto>(
      {
        query: (cartItemData) => ({
          url: '/cart-items',
          method: 'POST',
          body: cartItemData,
        }),
        // After adding an item, invalidate the 'Cart' tag to refetch the cart
        // and potentially update cart item lists if you have queries for those.
        invalidatesTags: ['Cart'],
        // You could also optimistically update the cache here if desired
      }
    ),
  }),
});

export const { useGetMyCartQuery, useCreateCartItemMutation } = cartApi;

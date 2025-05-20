import { apiSlice } from '@/redux/api/apiSlice';
import {
  Cart,
  CartItem,
  CreateCartItemResponse,
  GetMyCartResponse,
  UpdateCartItemResponse, // Added
  GetCartItemByIdResponse, // Added
  DeleteCartItemResponse, // Added
  CreateCartItemDto, // Already defined
  // ApiResponse, // Generic, used by specific response types
} from '@/types/cart'; // Adjust path as needed

// Define the request body for updating a cart item's quantity
export interface UpdateCartItemDto {
  quantity: number;
}

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/cart/my-cart - Get my cart (from previous implementation)
    getMyCart: builder.query<GetMyCartResponse, void>({
      query: () => '/cart/my-cart',
      providesTags: (result) =>
        result && result.data.data
          ? [
              { type: 'Cart' as const, id: result.data.data.id },
              { type: 'Cart' as const, id: 'LIST' },
            ]
          : [{ type: 'Cart' as const, id: 'LIST' }], // Provide a general list tag too
    }),

    // POST /api/v1/cart-items - Create a new cart item (from previous implementation)
    createCartItem: builder.mutation<CreateCartItemResponse, CreateCartItemDto>(
      {
        query: (cartItemData) => ({
          url: '/cart-items',
          method: 'POST',
          body: cartItemData,
        }),
        invalidatesTags: [{ type: 'Cart' as const, id: 'LIST' }], // Invalidate the general cart list
      }
    ),

    // GET /api/v1/cart-items/{itemId} - Get a specific cart item by its ID
    getCartItemById: builder.query<GetCartItemByIdResponse, string>({
      query: (itemId) => `/cart-items/${itemId}`,
      providesTags: (result, error, itemId) => [
        { type: 'CartItem' as const, id: itemId },
      ],
    }),

    // PATCH /api/v1/cart-items/{itemId} - Update an existing cart item (e.g., quantity)
    updateCartItem: builder.mutation<
      UpdateCartItemResponse,
      { itemId: string; body: UpdateCartItemDto }
    >({
      query: ({ itemId, body }) => ({
        url: `/cart-items/${itemId}`,
        method: 'PATCH', // Or 'PUT' if your API uses that for full replacement
        body: body,
      }),
      // After updating an item, invalidate the specific CartItem tag (if you query individual items)
      // and more importantly, the general 'Cart' list tag to refetch the whole cart.
      invalidatesTags: (result, error, { itemId }) => [
        { type: 'CartItem' as const, id: itemId },
        { type: 'Cart' as const, id: 'LIST' },
      ],
    }),

    // DELETE /api/v1/cart-items/{itemId} - Delete a cart item
    deleteCartItem: builder.mutation<DeleteCartItemResponse, string>({
      query: (itemId) => ({
        url: `/cart-items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, itemId) => [
        { type: 'CartItem' as const, id: itemId },
        { type: 'Cart' as const, id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetMyCartQuery,
  useCreateCartItemMutation,
  useGetCartItemByIdQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} = cartApi;

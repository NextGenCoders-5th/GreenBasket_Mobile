// redux/api/wishlistApi.ts
import { apiSlice } from './apiSlice';
import {
  WishlistItem,
  WishlistWithProduct,
  AddToWishlistResponse,
  GetWishlistsResponse,
  DeleteWishlistResponse,
} from '@/types/wishlist'; // Assuming your types are in types/wishlist.ts

// Add a tag type for wishlist items to manage caching
export const wishlistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/wishlist - Get all wishlist items for the logged-in user
    getWishlist: builder.query<GetWishlistsResponse, void>({
      query: () => '/wishlist',
      // Provide tags for the list and individual wishlist items
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(
                ({ id }) => ({ type: 'Wishlist' as const, id } as const)
              ),
              { type: 'Wishlist' as const, id: 'LIST' }, // Tag the list itself
            ]
          : [{ type: 'Wishlist' as const, id: 'LIST' }], // Tag the list even if empty
    }),

    // POST /api/v1/wishlist - Add a product to the wishlist
    // This endpoint likely requires the productId in the body
    addToWishlist: builder.mutation<
      AddToWishlistResponse,
      { productId: string }
    >({
      query: (data) => ({
        url: '/wishlist',
        method: 'POST',
        body: data, // Send { productId: string }
      }),
      // Invalidate the wishlist list after adding a new item
      // Optimistic update might be useful here as well
      invalidatesTags: [{ type: 'Wishlist' as const, id: 'LIST' }],
    }),

    // DELETE /api/v1/wishlist/{id} - Remove a wishlist item by its ID
    // This ID is the WishlistItem ID, not the Product ID
    deleteWishlist: builder.mutation<DeleteWishlistResponse, string>({
      query: (wishlistItemId) => ({
        url: `/wishlist/${wishlistItemId}`,
        method: 'DELETE',
      }),
      // Invalidate the specific wishlist item and the list after deletion
      invalidatesTags: (result, error, wishlistItemId) => [
        { type: 'Wishlist' as const, id: wishlistItemId },
        { type: 'Wishlist' as const, id: 'LIST' },
      ],
    }),
  }),
  // Use overrideExisting: true if this slice is injected after others
  overrideExisting: true, // Ensure this is set if injecting multiple endpoint slices
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useDeleteWishlistMutation,
} = wishlistApi;

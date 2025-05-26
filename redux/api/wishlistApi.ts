import { apiSlice } from './apiSlice';
import {
  AddToWishlistResponse,
  GetWishlistsResponse,
  DeleteWishlistResponse,
} from '@/types/wishlist'; // Assuming your types are in types/wishlist.ts

export const wishlistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

    addToWishlist: builder.mutation<AddToWishlistResponse, string>({
      query: (productId) => ({
        // The argument is the productId string
        url: `/wishlist/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: (result) => [{ type: 'Wishlist' as const, id: 'LIST' }],
    }),

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

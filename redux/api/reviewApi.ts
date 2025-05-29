// redux/api/reviewApi.ts
import { apiSlice } from './apiSlice';
import {
  CreateReviewDto,
  UpdateteReviewDto,
  CreateReviewResponse,
  GetReviewsByProductIdResponse,
  GetReviewByIdResponse,
  UpdateReviewResponse,
  DeleteReviewResponse,
  GetMyReviewsResponse,
} from '@/types/review'; // Assuming your types are in types/review.ts

// Correct the typo in the Update DTO type if confirmed
export type UpdateReviewDto = UpdateteReviewDto;

// Add a tag type for reviews to manage caching
export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/reviews - Create Review
    createReview: builder.mutation<CreateReviewResponse, CreateReviewDto>({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
      // Invalidate relevant data after creating a review:
      // - The list of reviews for the specific product (if applicable)
      // - The user's list of reviews
      // - The specific OrderItem (to potentially update its 'reviewed' status)
      invalidatesTags: (result, error, args) => {
        const tags = [{ type: 'Review' as const, id: 'LIST' }]; // Tag the list of *all* reviews (less specific)
        if (result?.data?.data) {
          const newReviewId = result.data.data.id;
          tags.push({ type: 'Review' as const, id: newReviewId }); // Tag the new review by ID
          tags.push({ type: 'Review' as const, id: 'MY_LIST' }); // Invalidate the user's review list
          // If your GetReviewsByProductIdResponse includes the Product ID in the response,
          // you could invalidate the product-specific list too.
          // Assuming args.orderItemId can be used to find the ProductId via backend:
          // tags.push({ type: 'Review' as const, id: `PRODUCT-${productId}` }); // Custom tag for product reviews

          // Invalidate the specific OrderItem's status
          tags.push({
            type: 'Order' as const,
            id: result.data.data.orderItemId,
            property: 'reviewed',
          }); // Example property invalidation
        }
        return tags;
      },
    }),

    // GET /api/v1/reviews/my-reviews - Get my reviews
    getMyReviews: builder.query<GetMyReviewsResponse, void>({
      query: () => '/reviews/my-reviews',
      // Provides tags for the user's list and individual reviews
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(
                ({ id }) => ({ type: 'Review' as const, id } as const)
              ),
              { type: 'Review' as const, id: 'MY_LIST' }, // Tag the user's list
            ]
          : [{ type: 'Review' as const, id: 'MY_LIST' }], // Tag the list even if empty
    }),

    // GET /api/v1/reviews/product/{productId} - Get reviews by product ID
    getReviewsByProductId: builder.query<GetReviewsByProductIdResponse, string>(
      {
        query: (productId) => `/reviews/product/${productId}`,
        // Provides tags for the product-specific list and individual reviews
        providesTags: (result, error, productId) =>
          result?.data?.data
            ? [
                ...result.data.data.map(
                  ({ id }) => ({ type: 'Review' as const, id } as const)
                ),
                { type: 'Review' as const, id: `PRODUCT-${productId}` }, // Tag the product-specific list
              ]
            : [{ type: 'Review' as const, id: `PRODUCT-${productId}` }], // Tag the list even if empty
      }
    ),

    // GET /api/v1/reviews/{id} - Get review by ID
    getReviewById: builder.query<GetReviewByIdResponse, string>({
      query: (id) => `/reviews/${id}`,
      // Provides tag for the specific review
      providesTags: (result, error, id) => [{ type: 'Review' as const, id }],
    }),

    // PATCH /api/v1/reviews/{id} - Update Review by ID
    updateReview: builder.mutation<
      UpdateReviewResponse,
      { id: string; body: UpdateReviewDto }
    >({
      query: ({ id, body }) => ({
        url: `/reviews/${id}`,
        method: 'PATCH',
        body,
      }),
      // Invalidate the specific review, user's list, and product list after update
      invalidatesTags: (result, error, args) => {
        const tags: Array<any> = [
          { type: 'Review' as const, id: args.id }, // Invalidate the specific review
          { type: 'Review' as const, id: 'MY_LIST' }, // Invalidate user's list
        ];
        // If you can determine the productId from the response or args,
        // you could also invalidate the product-specific list:
        // if (result?.data?.data?.OrderItem?.productId) {
        //    tags.push({ type: 'Review' as const, id: `PRODUCT-${result.data.data.OrderItem.productId}` });
        // }
        return tags;
      },
    }),

    // DELETE /api/v1/reviews/my-reviews/{id} - Delete Review by ID (user's own review)
    deleteMyReview: builder.mutation<DeleteReviewResponse, string>({
      // Endpoint has 'my-reviews' segment
      query: (id) => ({
        url: `/reviews/my-reviews/${id}`, // Use the correct endpoint path
        method: 'DELETE',
      }),
      // Invalidate the specific review, user's list, and product list after deletion
      invalidatesTags: (result, error, id) => {
        const tags: Array<any> = [
          { type: 'Review' as const, id }, // Invalidate the specific review
          { type: 'Review' as const, id: 'MY_LIST' }, // Invalidate user's list
        ];
        // Deleting a review also affects the product's reviews list.
        // Ideally, the backend response would include the product ID or order item ID
        // to invalidate the correct product reviews list.
        // Without that, a broader invalidation or knowing the product ID from the frontend is needed.
        // If you know the productId on the frontend when calling this:
        // tags.push({ type: 'Review' as const, id: `PRODUCT-${productId}` }); // Requires productId as arg or derived

        // As a fallback, if you can't easily get the product ID, you could invalidate all review lists:
        // tags.push({ type: 'Review' as const, id: 'LIST' }); // Invalidate general list
        // tags.push({ type: 'Review' as const, id: /^PRODUCT-/ }); // Invalidate all product-specific lists (regex)
        return tags;
      },
    }),
  }),
  // Use overrideExisting: true if this slice is injected after others
  overrideExisting: true, // Ensure this is set if injecting multiple endpoint slices
});

export const {
  useCreateReviewMutation,
  useGetMyReviewsQuery,
  useGetReviewsByProductIdQuery,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
  useDeleteMyReviewMutation, // Export the hook for deleting user's reviews
} = reviewApi;

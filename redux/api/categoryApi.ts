import { apiSlice } from './apiSlice';
import {
  CreateCategoryDto,
  CreateCategoryResponse,
  GetAllCategoriesResponse,
  GetCategoryByIdResponse,
  UpdateCategoryByIdResponse,
  DeleteCategoryByIdResponse,
} from '@/types/category'; // Assuming your types are in types/category.ts

// Add a tag type for categories to manage caching
export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/categories - Create a new category
    createCategory: builder.mutation<CreateCategoryResponse, CreateCategoryDto>(
      {
        query: (categoryData) => ({
          url: '/categories',
          method: 'POST',
          body: categoryData,
        }),
        // Invalidate the list of categories after creating a new one
        invalidatesTags: [{ type: 'Category' as const, id: 'LIST' }],
      }
    ),

    // GET /api/v1/categories - Find all categories
    getAllCategories: builder.query<GetAllCategoriesResponse, void>({
      query: () => '/categories',
      // Provide tags for the list and individual categories
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(
                ({ id }) => ({ type: 'Category' as const, id } as const)
              ),
              { type: 'Category' as const, id: 'LIST' }, // Tag the list itself
            ]
          : [{ type: 'Category' as const, id: 'LIST' }], // Tag the list even if empty
    }),

    // GET /api/v1/categories/{id} - Find category by ID
    getCategoryById: builder.query<GetCategoryByIdResponse, string>({
      query: (id) => `/categories/${id}`,
      // Provide tag for the specific category
      providesTags: (result, error, id) => [{ type: 'Category' as const, id }],
    }),

    // PATCH /api/v1/categories/{id} - Update category by ID
    updateCategoryById: builder.mutation<
      UpdateCategoryByIdResponse,
      { id: string; body: Partial<CreateCategoryDto> } // Use Partial<CreateCategoryDto> for update body
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body,
      }),
      // Invalidate the specific category and the list after update
      invalidatesTags: (result, error, args) => [
        { type: 'Category' as const, id: args.id },
        { type: 'Category' as const, id: 'LIST' },
      ],
    }),

    // DELETE /api/v1/categories/{id} - Delete category by ID
    deleteCategoryById: builder.mutation<DeleteCategoryByIdResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      // Invalidate the specific category and the list after deletion
      invalidatesTags: (result, error, id) => [
        { type: 'Category' as const, id },
        { type: 'Category' as const, id: 'LIST' },
      ],
    }),
  }),
  // Use overrideExisting: true if this slice is injected after others
  overrideExisting: true, // Ensure this is set if injecting multiple endpoint slices
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryByIdMutation,
  useDeleteCategoryByIdMutation,
} = categoryApi;

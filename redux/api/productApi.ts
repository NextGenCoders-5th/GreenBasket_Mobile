import { apiSlice } from './apiSlice';
import {
  ProductDetailResponse,
  ProductListResponse,
  CreateProductResponse,
  CreateProductDto,
  UpdateProductDto,
  GetProductsParams,
} from '@/types/product';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Find All Products
    getProducts: builder.query<ProductListResponse, GetProductsParams | void>({
      query: (params) => ({
        url: '/products',
        params: params || {}, // Pass params if they exist
      }),
      // Provides a list of 'Product' tags and a general 'LIST' tag.
      providesTags: (result) =>
        result && result.data.data
          ? [
              ...result.data.data.map(({ id }) => ({
                type: 'Product' as const,
                id,
              })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // 2. Find Product by ID
    getProductById: builder.query<ProductDetailResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // 3. Create Product
    createProduct: builder.mutation<CreateProductResponse, CreateProductDto>({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
      // Invalidates the 'LIST' tag to refetch the product list after creation.
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // 4. Update Product
    updateProduct: builder.mutation<
      ProductDetailResponse,
      { id: string; body: UpdateProductDto }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
      }),
      // Invalidates the specific product tag and the 'LIST' tag.
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // 5. Delete Product by ID
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

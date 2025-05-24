// redux/api/productApi.ts
import { apiSlice } from '@/redux/api/apiSlice';
import {
  Product,
  ProductDetailResponse,
  ProductListResponse,
  CreateProductResponse,
  ProductWithCategories,
  GetProductsParams,
  CreateProductDto,
  UpdateProductDto,
  ApiResponseEnvelope,
  GetProductsByCategoryResponse,
} from '@/types/product'; // Using @ alias

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/products - Find All Products
    getProducts: builder.query<ProductListResponse, GetProductsParams | void>({
      query: (params) => ({
        url: '/products', // Endpoint path from your definition
        params: params || {},
      }),
      providesTags: (result) =>
        result && result.data.data
          ? [
              ...result.data.data.map(({ id }) => ({
                type: 'Product' as const,
                id,
              })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),

    // GET /api/v1/products/{id} - Find Product by ID
    getProductById: builder.query<ProductDetailResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product' as const, id }],
    }),

    // POST /api/v1/products - Create Product
    createProduct: builder.mutation<CreateProductResponse, CreateProductDto>({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: [{ type: 'Product' as const, id: 'LIST' }],
    }),

    // PATCH /api/v1/products/{id} - Update Product by ID
    updateProduct: builder.mutation<
      ProductDetailResponse, // Assuming update returns ProductType (not ProductWithCategories)
      { id: string; body: UpdateProductDto }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product' as const, id },
        { type: 'Product' as const, id: 'LIST' },
      ],
    }),

    // DELETE /api/v1/products/{id} - Delete Product by ID
    deleteProduct: builder.mutation<
      ApiResponseEnvelope<{ message: string }>, // Assuming a generic success message envelope
      string
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product' as const, id },
        { type: 'Product' as const, id: 'LIST' },
      ],
    }),

    getProductsByCategory: builder.query<GetProductsByCategoryResponse, string>(
      {
        // Assuming the endpoint is '/products/category/{categoryId}'
        query: (categoryId) => ({
          url: `/products/category/${categoryId}`,
          method: 'GET',
        }),
        // Provides tags for the category itself and all products within it
        providesTags: (result, error, categoryId) => {
          const tags: Array<any> = [
            { type: 'Category' as const, id: categoryId },
          ]; // Tag the category
          if (result?.data?.data?.products) {
            // Tag each product found within the category
            result.data.data.products.forEach((product) => {
              tags.push({ type: 'Product' as const, id: product.id });
            });
            tags.push({ type: 'Product' as const, id: 'LIST' }); // Also tag the general product list
          }
          return tags;
        },
      }
    ),
  }),
  overrideExisting: true,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsByCategoryQuery,
} = productApi;

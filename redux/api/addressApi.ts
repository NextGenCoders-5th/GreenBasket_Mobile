import { apiSlice } from './apiSlice';
import {
  CreateAddressDto,
  CreateUserAddressResponse,
  GetUserAddressResponse,
  UpdateUserAddressResponse,
  UpdateUserAddressDto,
} from '@/types/address';

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUserAddress: builder.mutation<
      CreateUserAddressResponse,
      CreateAddressDto
    >({
      query: (addressData) => ({
        url: '/addresses/user',
        method: 'POST',
        body: addressData,
      }),

      invalidatesTags: (result) => {
        const tags = [];
        if (result?.data?.data) {
          tags.push({ type: 'Address' as const, id: result.data.data.id });
          // Invalidate the current user tag
          tags.push({ type: 'User' as const, id: 'ME' }); // Assuming 'ME' is your current user ID tag
        }
        return tags;
      },
    }),

    getUserAddress: builder.query<GetUserAddressResponse, void>({
      query: () => '/addresses/user',
      providesTags: (result) =>
        result?.data?.data
          ? [
              { type: 'Address' as const, id: result.data.data.id },
              { type: 'User' as const, id: 'ME' },
            ]
          : [],
    }),

    updateUserAddress: builder.mutation<
      UpdateUserAddressResponse,
      UpdateUserAddressDto
    >({
      query: (addressData) => ({
        url: '/addresses/user',
        method: 'PATCH',
        body: addressData,
      }),
      // Invalidate both the Address tag and the User tag after update
      invalidatesTags: (result) => {
        const tags = [];
        if (result?.data?.data) {
          tags.push({ type: 'Address' as const, id: result.data.data.id });
          tags.push({ type: 'User' as const, id: 'ME' });
        }
        return tags;
      },
    }),
  }),
});

export const {
  useCreateUserAddressMutation,
  useGetUserAddressQuery,
  useUpdateUserAddressMutation,
} = addressApi;

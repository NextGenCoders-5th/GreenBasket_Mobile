import { apiSlice } from './apiSlice';
import {
  AuthSignUpType,
  AuthSignUpResponseType,
  AuthSignInType,
  AuthSignInResponseType,
} from '../../types/auth';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthSignUpResponseType, AuthSignUpType>({
      query: (userData) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body: userData,
      }),
    }),
    signIn: builder.mutation<AuthSignInResponseType, AuthSignInType>({
      query: (credentials) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body: credentials,
      }),
    }),
    requestPasswordReset: builder.mutation<{ message: string }, string>({
      query: (email) => ({
        url: '/auth/request-reset',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<
      { message: string },
      { token: string; newPassword: string }
    >({
      query: ({ token, newPassword }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { token, newPassword },
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;

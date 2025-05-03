import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuthHandling } from './baseQuery';
import { setCredentials, setToken } from '../slices/authSlice';
import {
  AuthRefreshTokenResponseType,
  AuthSignInResponseType,
  AuthSignInType,
  AuthSignUpResponseType,
  AuthSignUpType,
} from '@/types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  // Use the shared base query function
  baseQuery: baseQueryWithAuthHandling,
  // Endpoints specific to authentication
  endpoints: (builder) => ({
    /**
     * Sign In Mutation
     */
    signIn: builder.mutation<AuthSignInResponseType, AuthSignInType>({
      query: (credentials) => ({
        url: 'auth/sign-in',
        method: 'POST',
        body: credentials,
      }),
      // Use onQueryStarted for side-effects after the request is initiated
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.log('[AuthAPI:signIn] Mutation started');
        try {
          const { data } = await queryFulfilled;
          console.log('[AuthAPI:signIn] Success:', data);
          // Dispatch action to store credentials (user, token)
          dispatch(
            setCredentials({
              user: data.data.data.data.user,
              token: data.data.data.accessToken,
              // refreshToken: data.refreshToken // If backend sends refresh token here
            })
          );
        } catch (error) {
          console.error('[AuthAPI:signIn] Failed:', error);
          // Error logging/handling is mostly done by the hook/baseQuery
        }
      },
    }),

    /**
     * Sign Up Mutation
     */
    signUp: builder.mutation<AuthSignUpResponseType, AuthSignUpType>({
      query: (userData) => ({
        url: 'auth/sign-up',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.log('[AuthAPI:signUp] Mutation started');
        try {
          const { data } = await queryFulfilled;
          console.log('[AuthAPI:signUp] Success:', data);
          // // Dispatch action to store credentials (log in user immediately)
          // dispatch(
          //   setCredentials({
          //     user: data.data.data,
          //     token: data.access_token,
          //     // refreshToken: data.refreshToken
          //   })
          // );
        } catch (error) {
          console.error('[AuthAPI:signUp] Failed:', error);
        }
      },
    }),

    /**
     * Refresh Token Mutation
     * Assumes you pass the necessary data (e.g., the refresh token) if required.
     * If refresh token is handled via httpOnly cookie, body might be empty.
     */
    refreshToken: builder.mutation<
      AuthRefreshTokenResponseType,
      { refreshToken: string } | void // Adjust input based on how you send the refresh token
    >({
      query: (body) => ({
        url: 'auth/refresh-token',
        method: 'POST',
        body: body, // Send refresh token in body if needed
        // Or configure headers specifically if needed for refresh token
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.log('[AuthAPI:refreshToken] Mutation started');
        try {
          const { data } = await queryFulfilled;
          console.log('[AuthAPI:refreshToken] Success:', data);
          // Dispatch action to update only the access token in the state
          dispatch(setToken({ token: data.data.accessToken }));
        } catch (error) {
          console.error('[AuthAPI:refreshToken] Failed:', error);
          // If refresh fails, the user should likely be logged out.
          // The baseQuery's 401 handler might catch this if refresh returns 401/403.
          // Or add specific dispatch(logOut()) here if needed.
          // dispatch(logOut());
        }
      },
    }),
  }),
});

// Export hooks for usage in components. They are automatically generated.
export const { useSignInMutation, useSignUpMutation, useRefreshTokenMutation } =
  authApi;

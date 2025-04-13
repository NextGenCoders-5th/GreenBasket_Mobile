import {
  UserSignInResponseType,
  UserSignInType,
  UserSignUpResponseType,
  UserSignUpType,
  UserType,
} from '@/types/user';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/v1/',
  }),
  endpoints: (build) => ({
    signUp: build.mutation<UserSignUpResponseType, UserSignUpType>({
      query: (signUpData) => ({
        url: 'auth/sign-up',
        method: 'POST',
        body: signUpData,
      }),
    }),
    signIn: build.mutation<UserSignInResponseType, UserSignInType>({
      query: (signInData) => ({
        url: 'auth/sign-in',
        method: 'POST',
        body: signInData,
      }),
    }),
  }),
});

export const { useSignUpMutation, useSignInMutation } = userApi;

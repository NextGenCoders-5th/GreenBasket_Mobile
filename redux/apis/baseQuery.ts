import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';
import { RootState } from '../store'; // Adjust path if needed
import { logOut } from '../slices/authSlice'; // Adjust path if needed
import { API_BASE_URL_DEV } from '@/constants/env';

// --- Configure Base URL ---
const baseUrl = Constants.expoConfig?.extra?.apiUrl || API_BASE_URL_DEV; // Your base URL with /api/v1/

if (!baseUrl || baseUrl === '/') {
  console.error(
    'API Base URL is not configured correctly. Check extra.apiUrl in app.json/app.config.js or hardcode in baseQuery.ts'
  );
}

// Create the core fetchBaseQuery instance
const coreBaseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState }) => {
    // Conditionally add the Authorization header
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
      console.log('[BaseQuery] Authorization header set');
    } else {
      console.log('[BaseQuery] No token found, Authorization header omitted');
    }
    headers.set('Accept', 'application/json');
    // Add other common headers if needed
    return headers;
  },
});

// Define the type for our base query function including potential meta/error types
type AppBaseQueryFn = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
>;

// Create a wrapper to handle 401 errors globally
export const baseQueryWithAuthHandling: AppBaseQueryFn = async (
  args,
  api,
  extraOptions
) => {
  console.log(`[BaseQuery] Requesting: ${JSON.stringify(args)}`);
  let result = await coreBaseQuery(args, api, extraOptions);
  console.log(
    `[BaseQuery] Response Status: ${result.meta?.response?.status}`,
    `Error: ${JSON.stringify(result.error)}`
  );

  // Handle 401 Unauthorized specifically for automatic logout
  if (result.error && result.error.status === 401) {
    console.warn('[BaseQuery] Received 401 Unauthorized. Logging out...');
    api.dispatch(logOut());
    // Optional: Could attempt refresh token logic here if result.error indicates
    // the access token expired AND a refresh token exists. This is more complex.
  }
  return result;
};

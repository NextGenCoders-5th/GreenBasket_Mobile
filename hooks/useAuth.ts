import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import {
  setCredentials,
  clearCredentials,
  selectIsAuthLoading, // Crucial for the useEffect condition
  selectCurrentUser, // For returning the user
  selectIsAuthenticated, // For returning isAuthenticated
} from '@/redux/slices/authSlice'; // Ensure this path is correct
import {
  useSignInMutation, // Assuming this is your RTK Query hook for login
  useLogoutMutation,
  useSignUpMutation,
} from '@/redux/api/authApi'; // Ensure this path is correct
import {
  AuthError, // Your specific error type from backend
  AuthSignInResponse, // Your specific sign-in response type
  AuthSignIn, // Your type for sign-in credentials
  AuthSignUp, // Your type for sign-up credentials (likely from form)
  // AuthSignUpType,  // If you have a separate type for the API call after transformation
  // CreateCartItemResponse, // Example if signup returns something specific
} from '@/types/auth'; // Ensure this path is correct
import { User } from '@/types/user'; // Ensure this path is correct
import { apiSlice } from '@/redux/api/apiSlice';

// Type guard for your specific backend authentication errors
function isAuthError(error: any): error is AuthError {
  return (
    error &&
    typeof error.status === 'number' && // Or error.originalStatus from RTK Query
    error.data &&
    typeof error.data.message === 'string' &&
    typeof error.data.statusCode === 'number'
  );
}

export const useAuth = () => {
  const dispatch = useDispatch();

  // Selectors to get current auth state from Redux
  const currentUser = useSelector(selectCurrentUser);
  const currentIsAuthenticated = useSelector(selectIsAuthenticated);
  const isLoadingFromState = useSelector(selectIsAuthLoading); // Key for controlling the effect

  // RTK Query mutation hooks
  const [signInMutation, { isLoading: isSignInLoading }] = useSignInMutation();
  const [signUpMutation, { isLoading: isSignUpLoading }] = useSignUpMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();

  // Effect for loading persisted authentication state on app startup
  useEffect(() => {
    const loadAuthState = async () => {
      // console.log(
      //   'useAuth EFFECT: Attempting to load auth state from AsyncStorage...'
      // );
      // This effect's purpose is to transition isLoading from true to false
      // by dispatching either setCredentials or clearCredentials.
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const userString = await AsyncStorage.getItem('user');

        if (accessToken && refreshToken && userString) {
          // console.log(
          //   'useAuth EFFECT: Found credentials. Dispatching setCredentials.'
          // );
          const user = JSON.parse(userString) as User;
          dispatch(setCredentials({ user, accessToken, refreshToken }));
        } else {
          // console.log(
          //   'useAuth EFFECT: No credentials found. Dispatching clearCredentials.'
          // );
          dispatch(clearCredentials());
        }
      } catch (error) {
        // console.error(
        //   'useAuth EFFECT: Failed to load auth state from AsyncStorage:',
        //   error
        // );
        dispatch(clearCredentials()); // Clear state on error too
      }
    };

    // --- CRITICAL CONDITION TO PREVENT LOOP ---
    // Only run the loading logic if the Redux state currently indicates it's loading.
    // Once it's false, this effect won't re-run the async logic even if useAuth re-renders.
    if (isLoadingFromState) {
      loadAuthState();
    }
  }, [dispatch, isLoadingFromState]); // Dependencies: dispatch (stable) and isLoadingFromState

  // Handle Sign In
  const handleSignIn = async (credentials: AuthSignIn) => {
    // console.log('useAuth: handleSignIn called');
    try {
      // The actual response type from unwrap might be different from AuthSignInResponse
      // if AuthSignInResponse is the type for the whole { data: { ... } } envelope.
      // Let's assume unwrap gives you the content of result.data.data directly if successful.
      const unwrappedResult = await signInMutation(credentials).unwrap();

      // Adjust this destructuring based on your ACTUAL unwrapped API response structure
      // For example, if your AuthSignInResponse is { data: { data: { user, accessToken, refreshToken } } }
      // then unwrappedResult might be { user, accessToken, refreshToken } if RTK Query handles the nesting.
      // Or, if unwrap gives AuthSignInResponse, then:
      // const { user, accessToken, refreshToken } = (unwrappedResult as AuthSignInResponse).data.data.data;
      const { user, accessToken, refreshToken } = (
        unwrappedResult as AuthSignInResponse
      ).data.data;

      dispatch(setCredentials({ user, accessToken, refreshToken }));
      return { success: true, user };
    } catch (error: any) {
      // console.error('useAuth: handleSignIn error:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (isAuthError(error)) {
        errorMessage = error.data.message;
      } else if (error.status === 'FETCH_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  // Handle Sign Up
  const handleSignUp = async (credentials: AuthSignUp) => {
    // console.log('useAuth: handleSignUp called');
    const { phoneNumber, ...restCredentials } = credentials;
    const fullPhoneNumber = `+251${phoneNumber}`; // Assuming this transformation is correct

    try {
      // Assuming signUpMutation expects the transformed credentials
      // And CreateCartItemResponse was a placeholder, adjust to your actual SignUp response type
      const result = await signUpMutation({
        ...restCredentials,
        phoneNumber: fullPhoneNumber,
      }).unwrap();
      // Signup usually doesn't log the user in automatically.
      // It might return a success message or the created user (without tokens).
      return { success: true, data: result.data }; // Adjust based on your API's signup response
    } catch (error: any) {
      // console.error('useAuth: handleSignUp error:', error);
      let errorMessage = 'Signup failed. Please try again.';
      if (isAuthError(error)) {
        errorMessage = error.data.message;
      } else if (error.status === 'FETCH_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    console.log('useAuth: handleLogout called');
    try {
      await logoutMutation().unwrap(); // Call the API logout endpoint
    } catch (apiError) {
      // Log API error but proceed with local logout anyway
      console.error(
        'useAuth: Logout API call failed (continuing local logout):',
        apiError
      );
    } finally {
      // ALWAYS clear credentials from Redux state and AsyncStorage
      dispatch(clearCredentials());
      dispatch(apiSlice.util.resetApiState());
    }
    return { success: true }; // Indicate local logout success
  };

  return {
    // Current state values from Redux (selected at the top of the hook)
    user: currentUser,
    isAuthenticated: currentIsAuthenticated,
    isLoading: isLoadingFromState, // This is the crucial initial loading state

    // Action trigger functions
    signIn: handleSignIn,
    signUp: handleSignUp,
    logout: handleLogout,

    // Specific loading states for actions (from RTK Query mutations)
    isSignInLoading,
    isSignUpLoading,
    isLogoutLoading,
  };
};

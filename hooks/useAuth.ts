import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsAuthLoading,
  setCredentials,
  clearCredentials,
  setAuthLoading,
} from '@/redux/slices/authSlice';
import {
  useSignInMutation,
  useLogoutMutation,
  useSignUpMutation,
} from '@/redux/api/authApi';
import {
  AuthErrorType,
  AuthSignInResponseType,
  AuthSignInType,
  AuthSignUpType,
} from '@/types/auth';
import { UserType } from '@/types/user';

function isAuthError(error: any): error is AuthErrorType {
  return (
    error &&
    typeof error.status === 'number' &&
    error.data &&
    typeof error.data.message === 'string' &&
    typeof error.data.statusCode === 'number'
  );
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsAuthLoading);

  const [signIn, { isLoading: isSignInLoading }] = useSignInMutation();
  const [signUp, { isLoading: isSignUpLoading }] = useSignUpMutation();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        dispatch(setAuthLoading(true));
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const userString = await AsyncStorage.getItem('user');

        if (accessToken && refreshToken && userString) {
          const user = JSON.parse(userString) as UserType;
          dispatch(setCredentials({ user, accessToken, refreshToken }));
        } else {
          dispatch(setAuthLoading(false));
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        dispatch(setAuthLoading(false));
      }
    };

    loadAuthState();
  }, [dispatch]);

  const handleSignIn = async (credentials: AuthSignInType) => {
    try {
      const result: AuthSignInResponseType = await signIn(credentials).unwrap();
      const { accessToken, refreshToken } = result.data.data;
      const user = result.data.data.user;

      dispatch(setCredentials({ user, accessToken, refreshToken }));
      return { success: true };
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (isAuthError(error)) {
        errorMessage = error.data.message;
      } else if (error.status === 'FETCH_ERROR') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleSignUp = async (credentials: AuthSignUpType) => {
    const { phoneNumber, ...restCredentials } = credentials;

    const fullPhoneNumber = `+251${phoneNumber}`;

    try {
      const result = await signUp({
        ...restCredentials,
        phoneNumber: fullPhoneNumber,
      }).unwrap();
      return { success: true, data: result.data };
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      console.log('Error:', error);
      if (isAuthError(error)) {
        errorMessage = error.data.message;
      } else if (error.status === 'FETCH_ERROR') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      return { success: true };
    } catch (error) {
      // Even if the API call fails, we still want to log out locally
      dispatch(clearCredentials());
      return { success: true };
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading:
      isLoading || isSignInLoading || isSignUpLoading || isLogoutLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    logout: handleLogout,
  };
};

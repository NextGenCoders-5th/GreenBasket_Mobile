import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserType } from '@/types/user';
import { RootState } from '@/redux/store';

interface AuthState {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: UserType;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Store tokens in AsyncStorage
      AsyncStorage.setItem('accessToken', accessToken);
      AsyncStorage.setItem('refreshToken', refreshToken);
      AsyncStorage.setItem('user', JSON.stringify(user));
    },
    updateTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      // Update tokens in AsyncStorage
      AsyncStorage.setItem('accessToken', accessToken);
      AsyncStorage.setItem('refreshToken', refreshToken);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Remove tokens from AsyncStorage
      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
      AsyncStorage.removeItem('user');
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCredentials,
  updateTokens,
  clearCredentials,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

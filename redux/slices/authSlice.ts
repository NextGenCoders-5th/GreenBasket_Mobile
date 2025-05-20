import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/user';
import { RootState } from '@/redux/store';

interface AuthState {
  user: User | null;
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
  isLoading: true, // Start true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false; // SET TO FALSE

      AsyncStorage.setItem('accessToken', accessToken);
      AsyncStorage.setItem('refreshToken', refreshToken);
      AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('AuthSlice: Credentials SET. isLoading: false');
    },
    updateTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string; // Or make refreshToken optional if it's not always updated
      }>
    ) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken; // Only update if provided

      AsyncStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        // Only set if refreshToken is part of the payload
        AsyncStorage.setItem('refreshToken', refreshToken);
      }
      console.log('AuthSlice: Tokens UPDATED.');
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false; // SET TO FALSE

      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
      AsyncStorage.removeItem('user');
      console.log('AuthSlice: Credentials CLEARED. isLoading: false');
    },
    // This action is generally for specific manual control, not the primary mechanism for initial load.
    // setAuthLoading: (state, action: PayloadAction<boolean>) => {
    //   state.isLoading = action.payload;
    // },
  },
});

// Only export setAuthLoading if you have a clear, non-looping use case for it.
export const {
  setCredentials,
  updateTokens,
  clearCredentials,
  // setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

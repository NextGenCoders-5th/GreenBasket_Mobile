// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { UserType } from '@/types/user'; // Adjust path
import { removeToken, storeToken } from '@/utils/tokenStorage'; // Adjust path

interface AuthState {
  user: UserType | null;
  token: string | null; // This will be the ACCESS token
  // refreshToken: string | null; // Optional: Store refresh token separately if needed
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  // refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: UserType;
        token: string /*; refreshToken?: string*/;
      }>
    ) => {
      const { user, token /*, refreshToken */ } = action.payload;
      state.user = user;
      state.token = token;
      // state.refreshToken = refreshToken ?? state.refreshToken; // Store refresh token if provided
      state.isAuthenticated = true;
      console.log('[AuthSlice] Credentials set, storing token...');
      storeToken(token); // Store the ACCESS token
      // Store refresh token separately if needed (e.g., in SecureStore with a different key)
    },
    /**
     * Updates only the access token in the state. Useful after token refresh.
     */
    setToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = !!state.token; // Ensure auth status reflects token presence
      console.log('[AuthSlice] Token updated, storing new token...');
      storeToken(action.payload.token);
    },
    logOut: (state) => {
      console.log('[AuthSlice] Logging out, clearing state and token...');
      state.user = null;
      state.token = null;
      // state.refreshToken = null;
      state.isAuthenticated = false;
      removeToken(); // Remove the ACCESS token
      // Remove refresh token from storage if applicable
    },
    loadToken: (state, action: PayloadAction<{ token: string | null }>) => {
      state.token = action.payload.token; // Load ACCESS token
      state.isAuthenticated = !!action.payload.token;
      if (!state.token) {
        state.user = null;
      }
      console.log(
        '[AuthSlice] Token loaded from storage:',
        state.isAuthenticated ? 'Found' : 'Not Found'
      );
      // Load refresh token from storage if applicable
    },
    setUser: (state, action: PayloadAction<{ user: UserType }>) => {
      state.user = action.payload.user;
      if (action.payload.user && state.token) {
        state.isAuthenticated = true;
      }
    },
  },
});

// Export all actions
export const { setCredentials, setToken, logOut, loadToken, setUser } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors remain the same
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState): UserType | null =>
  state.auth.user;
export const selectCurrentToken = (state: RootState): string | null =>
  state.auth.token;
// export const selectRefreshToken = (state: RootState): string | null => state.auth.refreshToken;

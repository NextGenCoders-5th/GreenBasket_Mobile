import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    // Add the authApi reducer using its reducerPath
    [authApi.reducerPath]: authApi.reducer,

    auth: authReducer,
  },
  // Add middleware for all APIs
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
  // .concat(userApi.middleware) // Add middleware for other APIs
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

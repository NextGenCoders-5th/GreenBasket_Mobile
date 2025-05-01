import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userAuthToken';

export const storeToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    console.log('Token stored successfully.');
  } catch (error) {
    console.error('Error storing the auth token:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log('Token retrieved:', !!token);
    return token;
  } catch (error) {
    console.error('Error getting the auth token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log('Token removed successfully.');
  } catch (error) {
    console.error('Error removing the auth token:', error);
  }
};

// contexts/ColorSchemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the types for color scheme preference and the context value
export type ColorSchemePreference = 'light' | 'dark' | 'system';
export type ActiveColorScheme = 'light' | 'dark'; // The actual scheme being applied

interface ColorSchemeContextValue {
  colorScheme: ActiveColorScheme; // The currently applied scheme (light or dark)
  preference: ColorSchemePreference; // The user's saved preference (light, dark, or system)
  setColorScheme: (scheme: ColorSchemePreference) => Promise<void>; // Function to change preference
  isLoaded: boolean; // Indicates if the preference has been loaded from storage
}

const ColorSchemeContext = createContext<ColorSchemeContextValue | undefined>(
  undefined
);

// Key for AsyncStorage
const COLOR_SCHEME_STORAGE_KEY = 'appColorSchemePreference';

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const deviceColorScheme = useDeviceColorScheme(); // 'light' | 'dark' | null
  const [preference, setPreference] = useState<ColorSchemePreference>('system'); // Default preference
  const [isLoaded, setIsLoaded] = useState(false); // Track if preference is loaded

  // Load saved preference from AsyncStorage on startup
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(
          COLOR_SCHEME_STORAGE_KEY
        );
        if (
          savedPreference &&
          (savedPreference === 'light' ||
            savedPreference === 'dark' ||
            savedPreference === 'system')
        ) {
          setPreference(savedPreference as ColorSchemePreference);
        } else {
          // If no saved preference, default to system
          setPreference('system');
        }
      } catch (error) {
        console.error('Failed to load color scheme preference:', error);
        // Fallback to system on error
        setPreference('system');
      } finally {
        setIsLoaded(true); // Loading is complete
      }
    };

    loadPreference();
  }, []); // Run only once on mount

  // Function to update preference and save to AsyncStorage
  const updatePreference = useCallback(
    async (scheme: ColorSchemePreference) => {
      try {
        await AsyncStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme);
        setPreference(scheme);
      } catch (error) {
        console.error('Failed to save color scheme preference:', error);
        // Optionally revert state or notify user on save error
      }
    },
    [] // useCallback dependencies
  );

  // Determine the active color scheme based on preference and device setting
  const activeColorScheme: ActiveColorScheme = useMemo(() => {
    if (preference === 'system') {
      // If preference is system, use device setting (default to light if device is null)
      return deviceColorScheme === 'dark' ? 'dark' : 'light';
    } else {
      // If preference is light or dark, use the preference
      return preference;
    }
  }, [preference, deviceColorScheme]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      colorScheme: activeColorScheme,
      preference,
      setColorScheme: updatePreference, // Provide the update function
      isLoaded,
    }),
    [activeColorScheme, preference, updatePreference, isLoaded] // Dependencies for memoization
  );

  return (
    <ColorSchemeContext.Provider value={contextValue}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

// Custom hook to consume the context
export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
}

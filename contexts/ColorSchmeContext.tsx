import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

type ColorSchemeContextType = 'light' | 'dark';

const ColorSchemeContext = createContext<ColorSchemeContextType>('light');

const ColorSchemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();

  return (
    <ColorSchemeContext.Provider value={colorScheme || 'light'}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

const useColorSchemeContext = () => {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error(
      'useColorSchemeContext must be used within a ColorSchemeProvider'
    );
  }
  return context;
};

export { ColorSchemeProvider, useColorSchemeContext };

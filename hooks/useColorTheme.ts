import { useTheme } from '@react-navigation/native';

export const useColorTheme = () => {
  const { colors } = useTheme();
  return colors;
};

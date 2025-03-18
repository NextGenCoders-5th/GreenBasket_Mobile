import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';
import { CustomTheme } from '@/types/theme';

const lightTheme: CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors.light,
  },
};

const darkTheme: CustomTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...Colors.dark,
  },
};

export { lightTheme, darkTheme };

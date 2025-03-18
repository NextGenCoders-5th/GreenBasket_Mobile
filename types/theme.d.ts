import '@react-navigation/native';
import { Theme } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

type CustomTheme = Theme & {
  colors: Theme['colors'] & typeof Colors.light;
};

declare module '@react-navigation/native' {
  export function useTheme(): CustomTheme;
}

import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const IconButton = ({
  icon,
  onPress,
  size = 24,
  color,
  style,
}: IconButtonProps) => {
  const colors = useColorTheme();

  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <Ionicons name={icon} size={size} color={color || colors.primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 8,
  },
});

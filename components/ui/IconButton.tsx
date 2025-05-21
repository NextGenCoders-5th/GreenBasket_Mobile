import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme';

interface IconButtonProps extends TouchableOpacityProps {
  icon:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
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

  const isIonicons = icon in Ionicons.glyphMap;
  const IconLibrary = isIonicons ? Ionicons : MaterialCommunityIcons;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <IconLibrary
        name={icon as any}
        size={size}
        color={color || colors.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 2,
    borderRadius: 5,
  },
});

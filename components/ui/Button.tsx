import { useColorTheme } from '@/hooks/useColorTheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  icon?:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  size?: number;
  iconColor?: string;
  title: string;
  titleStyle?: TextStyle;
  isLoading?: boolean;
  loadingColor?: string;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  size = 24,
  iconColor = '#fff',
  title,
  titleStyle,
  onPress,
  style,
  isLoading = false,
  loadingColor = '#fff',
  ...props
}) => {
  const colors = useColorTheme();
  const isIonicons = icon && icon in Ionicons.glyphMap;
  const IconLibrary = isIonicons ? Ionicons : MaterialCommunityIcons;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
          gap: 10,
        },
        title: {
          fontWeight: '700',
          color: colors['white'],
          fontSize: 16,
        },
      }),
    []
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      {...props}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={loadingColor} size='small' />
      ) : (
        <>
          <IconLibrary name={icon as any} size={size} color={iconColor} />
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;

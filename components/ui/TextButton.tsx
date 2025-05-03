import { useColorTheme } from '@/hooks/useColorTheme';
import { isLoading } from 'expo-font';
import React, { useMemo } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

interface TextButtonProps extends TouchableOpacityProps {
  title: string;
  titleStyle?: TextStyle;
  isLoading?: boolean;
  loadingColor?: string;
  onPress: () => void;
}

const TextButton: React.FC<TextButtonProps> = ({
  title,
  titleStyle,
  onPress,
  style,
  isLoading = false,
  loadingColor = '#fff',
  ...props
}) => {
  const colors = useColorTheme();

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
    >
      {isLoading ? (
        <ActivityIndicator color={loadingColor} size='small' />
      ) : (
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default TextButton;

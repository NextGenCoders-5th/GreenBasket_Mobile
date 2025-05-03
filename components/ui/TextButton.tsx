import { useColorTheme } from '@/hooks/useColorTheme';
import React, { useMemo } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  TextStyle,
} from 'react-native';

interface TextButtonProps extends TouchableOpacityProps {
  title: string;
  titleStyle?: TextStyle;
  onPress: () => void;
}

const TextButton: React.FC<TextButtonProps> = ({
  title,
  titleStyle,
  onPress,
  style,
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
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TextButton;

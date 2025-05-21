import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useColorTheme } from '@/hooks/useColorTheme';

interface AccountButtonProps {
  label: string;
  labelStyle?: TextStyle;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  style?: ViewStyle;
}

const AccountButton: React.FC<AccountButtonProps> = ({
  label,
  labelStyle,
  onPress,
  icon = 'chevron-forward-outline',
  iconColor = '#656766',
  style,
}) => {
  const colors = useColorTheme();

  return (
    <Pressable
      style={[
        styles.btn,
        { backgroundColor: colors['gray-50'], borderColor: colors['gray-200'] },
        style,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text
        style={{ ...styles.label, color: colors['primary-800'], ...labelStyle }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 5,
    borderBottomWidth: 1,
    gap: 10,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AccountButton;

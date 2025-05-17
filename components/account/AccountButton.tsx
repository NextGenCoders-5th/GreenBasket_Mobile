import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useColorTheme } from '@/hooks/useColorTheme';

interface AccountButtonProps {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

const AccountButton: React.FC<AccountButtonProps> = ({
  label,
  onPress,
  icon = 'chevron-forward-outline',
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
      <Text style={{ ...styles.label, color: colors['primary-800'] }}>
        {label}
      </Text>
      <Ionicons name={icon} size={20} color={colors['gray-600']} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AccountButton;

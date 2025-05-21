import { useColorTheme } from '@/hooks/useColorTheme';
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

interface ProfileButtonProps {
  label?: string;
  value: string;
  onPress: () => void;
  style?: ViewStyle;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({
  label,
  value,
  onPress,
  style,
}) => {
  const colors = useColorTheme();
  return (
    <Pressable
      style={[
        styles.container,
        { borderBottomColor: colors['gray-200'] },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={{ ...styles.value, color: colors.text }}>{value}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
    paddingVertical: 5,
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
  },
  value: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '300',
  },
});

export default ProfileButton;

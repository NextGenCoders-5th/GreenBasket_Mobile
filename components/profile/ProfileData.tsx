import { useColorTheme } from '@/hooks/useColorTheme';
import React from 'react';
import { Text, StyleSheet, ViewStyle, View } from 'react-native';

interface ProfileDataProps {
  label?: string;
  value1?: string;
  value2?: string;
  style?: ViewStyle;
}

const ProfileData: React.FC<ProfileDataProps> = ({
  label,
  value1,
  value2,
  style,
}) => {
  const colors = useColorTheme();
  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: colors['gray-200'] },
        style,
      ]}
    >
      <Text style={{ ...styles.label, color: colors.text }}>{label}</Text>
      <Text style={{ ...styles.value, color: colors.text }}>
        {`${value1 || 'Not set'} ${value2 || ''}`}
      </Text>
    </View>
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

export default ProfileData;

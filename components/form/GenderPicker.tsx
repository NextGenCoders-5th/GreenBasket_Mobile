import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorTheme } from '@/hooks/useColorTheme';

interface GenderPickerProps {
  onGenderSelect: (gender: 'male' | 'female') => void;
  selectedGender?: string;
  label: string;
}

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
] as const;

const GenderPicker: React.FC<GenderPickerProps> = ({
  onGenderSelect,
  selectedGender,
  label,
}) => {
  const colors = useColorTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.labelStyle, { color: colors['gray-700'] }]}>
        {label}
      </Text>
      <View style={styles.optionsContainer}>
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender.value}
            style={[
              styles.optionButton,
              { borderColor: colors['gray-300'] },
              selectedGender === gender.value && {
                backgroundColor: colors['primary-100'],
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onGenderSelect(gender.value)}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color:
                    selectedGender === gender.value
                      ? colors.primary
                      : colors['gray-700'],
                },
              ]}
            >
              {gender.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  labelStyle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Or 'flex-start' with gap
    gap: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});

export default GenderPicker;

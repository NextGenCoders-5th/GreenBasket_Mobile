import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, TextInput, View, Text } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useColorTheme } from '@/hooks/useColorTheme';
import ErrorMessage from '../ui/ErrorMessage';

type PhoneNumberInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
};

export default function PhoneNumberInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: PhoneNumberInputProps<T>) {
  const [isFocused, setIsFocused] = useState(false);

  const position = useRef(
    new Animated.Value(!!control._formValues[name] ? -12 : 15)
  ).current;

  const colors = useColorTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        useEffect(() => {
          const shouldMoveUp = isFocused || !!value;
          Animated.timing(position, {
            toValue: shouldMoveUp ? 0 : 15,
            duration: 150,
            useNativeDriver: false,
          }).start();
        }, [isFocused, value]);

        // Handle phone number change (only allow 9 digits)
        const handlePhoneChange = (text: string) => {
          const digitsOnly = text.replace(/\D/g, '');
          // Limit to 9 digits
          onChange(digitsOnly.slice(0, 9));
        };

        return (
          <View style={{ gap: 2 }}>
            <View
              style={{
                ...styles.container,
                backgroundColor: colors.background,
                borderColor: error
                  ? colors.red
                  : isFocused
                  ? colors.primary
                  : colors['gray-400'],
                borderWidth: isFocused ? 2 : 1,
              }}
            >
              {/* Label */}
              <Animated.Text
                style={{
                  ...styles.label,
                  top: position,
                  fontSize: isFocused || value ? 12 : 14,
                  color: colors['gray-600'],
                  backgroundColor: colors.background,
                  display: isFocused || value ? 'flex' : 'none',
                }}
              >
                {label}
              </Animated.Text>
              <View
                style={{
                  flex: 1,
                  gap: 4,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  top: isFocused || value ? 5 : 0,
                }}
              >
                {/* Fixed Country Code */}
                <View style={styles.countryCodeContainer}>
                  <Text
                    style={[
                      styles.countryCodeText,
                      { color: colors['gray-600'] },
                    ]}
                  >
                    +251
                  </Text>
                </View>

                {/* Phone Number Input (9 digits) */}
                <TextInput
                  keyboardType='phone-pad'
                  placeholder={isFocused ? '' : placeholder}
                  placeholderTextColor={colors['gray-600']}
                  onBlur={() => {
                    onBlur();
                    setIsFocused(false);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onChangeText={handlePhoneChange}
                  value={value} // Value from react-hook-form (9 digits)
                  style={{
                    ...styles.input,
                    color: colors['gray-800'],
                    outline: 'none',
                  }}
                  maxLength={9} // Enforce 9 digits max
                />
              </View>
            </View>
            {error && <ErrorMessage message={error.message!} />}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  label: {
    position: 'absolute',
    left: 2,
    fontFamily: 'Inter',
    fontWeight: '400',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
  },
  countryCodeContainer: {
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 12, // Match input font size
    fontFamily: 'Inter',
    fontWeight: '400',
  },
});

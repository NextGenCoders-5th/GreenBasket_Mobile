import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, useColorScheme } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import CountryPicker, {
  Country,
  CountryCode as PickerCountryCode,
  DARK_THEME,
} from 'react-native-country-picker-modal';
import {
  Examples,
  CountryCode as LibPhoneCountryCode,
  NationalNumber,
  getExampleNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

import { useColorTheme } from '@/hooks/useColorTheme';
import examples from '@/utils/examples.mobile.json';

type PhoneNumberInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
};

const convertToExamples = (data: Record<string, string>): Examples => {
  return Object.keys(data).reduce((acc, key) => {
    acc[key as keyof Examples] = data[key] as NationalNumber;
    return acc;
  }, {} as Examples);
};

const convertedExamples = convertToExamples(examples);

export default function PhoneNumberInput<T extends FieldValues>({
  control,
  name,
  label,
}: PhoneNumberInputProps<T>) {
  const [countryCode, setCountryCode] = useState<PickerCountryCode>('ET');
  const [callingCode, setCallingCode] = useState<string>('251');
  const [placeholder, setPlaceholder] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const colorScheme = useColorScheme();

  const colors = useColorTheme();

  // Handle country selection
  const handleSelectCountry = (country: Country) => {
    setCountryCode(country.cca2 as PickerCountryCode);
    setCallingCode(country.callingCode[0]);
  };

  // Update placeholder with sample phone number when country changes
  useEffect(() => {
    const exampleNumber = getExampleNumber(
      countryCode as LibPhoneCountryCode,
      convertedExamples
    );
    if (exampleNumber) {
      setPlaceholder(exampleNumber.nationalNumber);
    } else {
      setPlaceholder('');
    }
  }, [countryCode]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => {
        // Ensure country code is added to value when callingCode changes
        useEffect(() => {
          if (value && !value.startsWith(`+${callingCode}`)) {
            onChange(`+${callingCode}${value.replace(/^\+?\d+/, '')}`);
          }
        }, [callingCode, value, onChange]);

        useEffect(() => {
          if (placeholder) {
            onChange('');
          }
        }, [placeholder]);

        const handlePhoneNumberChange = (input: string) => {
          const formattedInput = `+${callingCode}${input.replace(
            new RegExp(`^\\+?${callingCode}`),
            ''
          )}`;

          const phoneNumber = parsePhoneNumberFromString(formattedInput);

          if (phoneNumber?.isValid()) {
            // onChange(phoneNumber.formatInternational());
            onChange(phoneNumber.formatInternational());
          } else {
            onChange(formattedInput);
          }
        };

        return (
          <View style={{ width: '100%', position: 'relative' }}>
            {/* Label */}
            <Text
              style={{
                position: 'absolute',
                left: 6,
                top: -10,
                fontFamily: 'Inter',
                fontSize: 16,
                color: isFocused ? colors.primary : colors['gray-800'],
                fontWeight: '600',
                backgroundColor: colors['gray-50'],
                zIndex: 1,
              }}
            >
              {label}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: isFocused ? colors.primary : colors['gray-400'],
                borderRadius: 5,
                paddingHorizontal: 8,
              }}
            >
              {/* Country Picker */}
              <CountryPicker
                withFlag
                withCallingCode
                withFilter
                withAlphaFilter
                withEmoji
                onSelect={handleSelectCountry}
                countryCode={countryCode}
                containerButtonStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                {...(colorScheme === 'dark' ? { theme: DARK_THEME } : {})}
              />

              {/* Country Code Display */}
              <Text
                style={{
                  color: colors['gray-700'],
                  fontFamily: 'inter',

                  fontSize: 16,
                  fontWeight: '200',
                  paddingRight: 8,
                }}
              >
                +{callingCode}
              </Text>

              {/* Input */}
              <TextInput
                style={{
                  flex: 1,
                  fontFamily: 'Inter',
                  paddingVertical: 15,
                  fontSize: 16,
                  fontWeight: '200',
                  color: colors['gray-700'],
                  outline: 'none',
                }}
                onBlur={() => {
                  onBlur();
                  setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                onChangeText={handlePhoneNumberChange}
                value={value?.replace(`+${callingCode}`, '') || ''}
                placeholder={placeholder}
                keyboardType='phone-pad'
              />
            </View>
          </View>
        );
      }}
    />
  );
}

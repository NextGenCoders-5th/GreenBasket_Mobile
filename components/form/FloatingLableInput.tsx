import React, { useState, useEffect, useRef } from 'react';
import { Animated, TextInput, View } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useColorTheme } from '@/hooks/useColorTheme';

type FloatingLabelInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
};

export default function FloatingLabelInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: FloatingLabelInputProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const position = useRef(
    new Animated.Value(!!control._formValues[name] ? -12 : 15)
  ).current;

  const colors = useColorTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => {
        useEffect(() => {
          // Move label up only if focused or has value
          const shouldMoveUp = isFocused || !!value;
          Animated.timing(position, {
            toValue: shouldMoveUp ? -12 : 15,
            duration: 100,
            useNativeDriver: false,
          }).start();
        }, [isFocused, value]);

        return (
          <View
            style={{
              width: '100%',
              position: 'relative',
              borderWidth: 1,
              padding: 4,
              borderRadius: 5,
              borderColor: isFocused ? colors.primary : colors['gray-400'],
            }}
          >
            {/* Label */}
            <Animated.Text
              style={{
                position: 'absolute',
                top: position,
                fontFamily: 'Inter',
                fontSize: isFocused || !!value ? 16 : 14,
                color: isFocused ? colors.primary : colors['gray-800'],
                fontWeight: '600',
                backgroundColor: colors['gray-50'],
                marginLeft: 2,
                display: isFocused || value ? 'flex' : 'none',
              }}
            >
              {label}
            </Animated.Text>

            {/* TextInput */}
            <TextInput
              placeholder={isFocused ? '' : placeholder}
              onBlur={() => {
                onBlur();
                setIsFocused(false);
              }}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              value={value}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 4,
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: '200',
                color: colors['gray-700'],
                outline: 'none',
              }}
            />
          </View>
        );
      }}
    />
  );
}

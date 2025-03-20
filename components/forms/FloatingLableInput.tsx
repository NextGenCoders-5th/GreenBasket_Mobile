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
    new Animated.Value(!!control._formValues[name] ? -8 : 15)
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
            toValue: shouldMoveUp ? -8 : 15,
            duration: 100,
            useNativeDriver: false,
          }).start();
        }, [isFocused, value]);

        return (
          <View style={{ width: '100%', position: 'relative' }}>
            {/* Label */}
            <Animated.Text
              style={{
                position: 'absolute',
                left: 4,
                top: position,
                fontSize: isFocused || !!value ? 16 : 14,
                color: isFocused ? colors.primary : colors['gray-800'],
                fontWeight: '700',
                backgroundColor: colors['gray-50'],
                paddingHorizontal: 4,
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
                paddingVertical: 15,
                paddingHorizontal: 8,
                fontSize: 16,
                fontWeight: '500',
                color: colors['gray-700'],
                borderWidth: isFocused ? 3 : 1,
                borderRadius: 5,
                borderColor: isFocused ? colors.primary : colors['gray-400'],
                outline: 'none',
              }}
            />
          </View>
        );
      }}
    />
  );
}

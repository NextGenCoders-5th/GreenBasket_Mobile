import React, { useState, useEffect, useRef } from 'react';
import { Animated, TextInput, View } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useColorTheme } from '@/hooks/useColorTheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton } from '../IconButton';

type FloatingLabelInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  icon?:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
};

export default function FloatingLabelInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  icon,
}: FloatingLabelInputProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const position = useRef(
    new Animated.Value(!!control._formValues[name] ? -12 : 15)
  ).current;

  const colors = useColorTheme();

  const isIonicons = icon && icon in Ionicons.glyphMap;
  const IconLibrary = isIonicons ? Ionicons : MaterialCommunityIcons;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => {
        useEffect(() => {
          // Move label up only if focused or has value
          const shouldMoveUp = isFocused || !!value;
          Animated.timing(position, {
            toValue: shouldMoveUp ? -12 : 20,
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
              backgroundColor: colors['gray-50'],
              borderRadius: 5,
              borderColor: isFocused ? colors.primary : colors['gray-400'],
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {/* Label */}
            <Animated.Text
              style={{
                position: 'absolute',
                top: position,
                fontFamily: 'Inter',
                fontSize: 16,
                color: isFocused ? colors.primary : colors['gray-800'],
                fontWeight: '600',
                backgroundColor: colors['gray-50'],
                marginLeft: icon ? 28 : 2,
                display: isFocused || value ? 'flex' : 'none',
              }}
            >
              {label}
            </Animated.Text>

            {/* TextInput */}
            {icon && (
              <IconLibrary
                name={icon as any}
                size={20}
                color={colors['gray-400']}
              />
            )}
            <TextInput
              secureTextEntry={!isPasswordVisible}
              placeholder={isFocused ? '' : placeholder}
              onBlur={() => {
                onBlur();
                setIsFocused(false);
              }}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              value={value}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 4,
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: '200',
                color: colors['gray-700'],
                outline: 'none',
              }}
            />

            {(name === 'password' || name === 'confirmPassword') && (
              <IconButton
                icon={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color={colors['gray-600']}
                onPress={() => {
                  setIsPasswordVisible((prev) => !prev);
                }}
              />
            )}
          </View>
        );
      }}
    />
  );
}

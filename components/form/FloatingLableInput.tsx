import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';
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
            toValue: shouldMoveUp ? -14 : 20,
            duration: 100,
            useNativeDriver: false,
          }).start();
        }, [isFocused, value]);

        return (
          <View
            style={{
              ...styles.container,
              backgroundColor: colors.background,
              borderColor: isFocused ? colors.primary : colors['gray-400'],
            }}
          >
            {/* Label */}
            <Animated.Text
              style={{
                ...styles.label,
                marginLeft: icon ? 33 : 2,
                top: position,
                color: isFocused ? colors.primary : colors['gray-600'],
                backgroundColor: colors.background,
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
                color={colors['primary-400']}
              />
            )}
            <TextInput
              secureTextEntry={
                (name === 'password' || name === 'confirmPassword') &&
                !isPasswordVisible
              }
              keyboardType={name === 'email' ? 'email-address' : 'default'}
              placeholder={isFocused ? '' : placeholder}
              placeholderTextColor={colors['gray-400']}
              onBlur={() => {
                onBlur();
                setIsFocused(false);
              }}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              value={value}
              style={{
                ...styles.input,
                color: colors['gray-400'],
              }}
            />

            {(name === 'password' || name === 'confirmPassword') && (
              <IconButton
                icon={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color={colors['primary-400']}
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    borderWidth: 1,
    padding: 4,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  label: {
    position: 'absolute',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '200',
    outline: 'none',
  },
});

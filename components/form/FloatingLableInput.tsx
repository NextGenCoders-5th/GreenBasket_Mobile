import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useColorTheme } from '@/hooks/useColorTheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton } from '../IconButton';
import ErrorMessage from './ErrorMessage';

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
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        useEffect(() => {
          // Move label up only if focused or has value
          const shouldMoveUp = isFocused || !!value;
          Animated.timing(position, {
            toValue: shouldMoveUp ? 0 : 15,
            duration: 150,
            useNativeDriver: false,
          }).start();
        }, [isFocused, value]);

        return (
          <View
            style={{
              gap: 2,
            }}
          >
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
                  marginLeft: icon ? 24 : 4,
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
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  top: isFocused || value ? 5 : 0,
                }}
              >
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
                    (name === 'password' || name === 'passwordConfirm') &&
                    !isPasswordVisible
                  }
                  keyboardType={name === 'email' ? 'email-address' : 'default'}
                  placeholder={isFocused ? '' : placeholder}
                  placeholderTextColor={colors['gray-600']}
                  onBlur={() => {
                    onBlur();
                    setIsFocused(false);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    ...styles.input,
                    color: colors['gray-800'],
                    outline: 'none',
                  }}
                />
              </View>
              {(name === 'password' || name === 'passwordConfirm') && (
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
            {error && <ErrorMessage message={error.message!} />}
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
    fontWeight: '400',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
  },
});

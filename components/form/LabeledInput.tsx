// components/form/LabeledInput.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useColorTheme } from '@/hooks/useColorTheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ErrorMessage from '../ui/ErrorMessage';
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';

// Define the props for the LabeledInput component
interface LabeledInputProps<T extends FieldValues> extends TextInputProps {
  label: string;
  icon?:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  // Props from react-hook-form's Controller render prop
  field: ControllerRenderProps<T, Path<T>>;
  error?: FieldError; // Pass the error object directly
}

function LabeledInputInner<T extends FieldValues>(
  {
    label,
    icon,
    field, // Receive the field object
    error, // Receive the error object
    placeholder, // Receive placeholder directly (will be used now)
    secureTextEntry, // Explicitly receive secureTextEntry
    ...rest // Capture other standard TextInput props
  }: LabeledInputProps<T>,
  ref: React.Ref<TextInput> // Forward ref for TextInput
) {
  const colors = useColorTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isIonicons = icon && icon in Ionicons.glyphMap;
  const IconLibrary = isIonicons ? Ionicons : MaterialCommunityIcons;

  // Determine if it's a password input based on prop or standard names
  const isPasswordInput =
    secureTextEntry !== undefined ||
    field.name === 'password' ||
    field.name === 'passwordConfirm';

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={[styles.label, { color: colors['gray-700'] }]}>{label}</Text>

      {/* Input and Icon Container */}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? colors.red
              : isFocused
              ? colors.primary
              : colors['gray-300'], // Use a slightly lighter border when not focused
            borderWidth: isFocused ? 2 : 1,
            backgroundColor: colors.background, // Set background color
          },
        ]}
      >
        {icon && (
          <IconLibrary
            name={icon as any}
            size={20}
            color={
              error
                ? colors.red
                : isFocused
                ? colors.primary
                : colors['gray-400']
            } // Icon color based on state
          />
        )}
        <TextInput
          ref={ref} // Forward the ref
          secureTextEntry={isPasswordInput && !isPasswordVisible} // Handle password visibility internally if marked as secure
          placeholder={placeholder || label} // Use provided placeholder or label
          placeholderTextColor={colors['gray-500']} // A bit darker for placeholder
          onBlur={(e) => {
            field.onBlur(); // Call the react-hook-form onBlur
            setIsFocused(false);
            if (rest.onBlur) rest.onBlur(e); // Call original onBlur if provided
          }}
          onFocus={(e) => {
            setIsFocused(true);
            if (rest.onFocus) rest.onFocus(e); // Call original onFocus if provided
          }}
          onChangeText={field.onChange} // Use the react-hook-form onChangeText
          value={field.value} // Use the react-hook-form value
          style={[
            styles.input,
            {
              color: colors['gray-800'], // Input text color
              // Add horizontal padding if no icon
              paddingLeft: icon ? 0 : 10,
              // Ensure consistent vertical padding
              paddingVertical: 12,
              outline: 'none',
            },
          ]}
          // Pass through other standard TextInput props
          {...rest}
        />
        {/* Password Toggle Icon */}
        {isPasswordInput && (
          <Ionicons // Assuming you prefer Ionicons for eye icons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={colors['gray-400']}
            onPress={() => {
              setIsPasswordVisible((prev) => !prev);
            }}
            style={styles.passwordToggleIcon}
          />
        )}
      </View>
      {/* Error Message */}
      {error && <ErrorMessage message={error.message!} />}
    </View>
  );
}

// Wrap with React.forwardRef
const LabeledInput = React.forwardRef(LabeledInputInner) as <
  T extends FieldValues
>(
  props: LabeledInputProps<T> & { ref?: React.Ref<TextInput> }
) => React.ReactElement | null; // Allow null return for React.forwardRef

export default LabeledInput;

const styles = StyleSheet.create({
  container: {
    // Outer container for the label, input, and error message
    marginBottom: 15, // Add some space below the input
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 5, // Space between label and input
  },
  inputContainer: {
    // Container for the TextInput, icon, and password toggle
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10, // Inner horizontal padding
    gap: 10, // Space between icon/input
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  passwordToggleIcon: {
    // Optional: Add padding or margin to the icon if needed
    padding: 5,
  },
});

import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  TextInput,
  Button,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme';
import FloatingLabelInput from './FloatingLableInput';
import ErrorMessage from './ErrorMessage';
import { IconButton } from '../IconButton';
import TextButton from '../TextButton';

// Yup validation schema
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  username: yup.string().required('Username is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: yup
    .string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Phone number is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm your password'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required(),
});

type FormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

export default function SignUpForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const colors = useColorTheme();

  const onSubmit = (data: FormData) => {
    // Alert.alert('Form Data', JSON.stringify(data, null, 2));
    console.log('data', data);
  };

  const [isFocused, setIsFocused] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25,
      }}
    >
      {/* Logo */}
      <Image source={require('@/assets/images/react-logo.png')} />

      <View
        style={{
          display: 'flex',
          gap: 10,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 24,
            color: colors['gray-800'],
            fontWeight: '700',
            marginBottom: 10,
          }}
        >
          Create account
        </Text>

        {/* First Name */}
        <View
          style={{
            width: '100%',
            padding: 5,
            gap: 4,
          }}
        >
          <FloatingLabelInput
            control={control}
            name='firstName'
            label='First name'
            placeholder='First name'
          />
          {errors.firstName && (
            <ErrorMessage message={errors.firstName.message!} />
          )}
        </View>

        {/* Last name */}
        <View
          style={{
            width: '100%',
            padding: 5,
            gap: 4,
          }}
        >
          <FloatingLabelInput
            control={control}
            name='lastName'
            label='Last name'
            placeholder='Last name'
          />
          {errors.lastName && (
            <ErrorMessage message={errors.lastName.message!} />
          )}
        </View>

        {/* Username */}
        <View
          style={{
            width: '100%',
            padding: 5,
            gap: 4,
          }}
        >
          <FloatingLabelInput
            control={control}
            name='username'
            label='Username'
            placeholder='Username'
          />
          {errors.username && (
            <ErrorMessage message={errors.username.message!} />
          )}
        </View>

        {/* Email */}
        <View
          style={{
            width: '100%',
            padding: 5,
            gap: 4,
          }}
        >
          <FloatingLabelInput
            control={control}
            name='email'
            label='Email'
            placeholder='Email'
          />
          {errors.email && <ErrorMessage message={errors.email.message!} />}
        </View>

        {/* Phone Number */}
        <View
          style={{
            width: '100%',
            padding: 5,
            gap: 4,
          }}
        >
          <FloatingLabelInput
            control={control}
            name='phoneNumber'
            label='Phone Number'
            placeholder='Phone Number'
          />
          {errors.phoneNumber && (
            <ErrorMessage message={errors.phoneNumber.message!} />
          )}
        </View>

        {/* Password */}
        <View
          style={{
            width: '100%',
            padding: 5,
            gap: 4,
          }}
        >
          <FloatingLabelInput
            control={control}
            name='password'
            label='Password'
            placeholder='Password'
          />
          {errors.password && (
            <ErrorMessage message={errors.password.message!} />
          )}
        </View>

        {/* Confirm Password */}
        <View
          style={{
            width: '100%',
            padding: 5,
            gap: 4,
          }}
        >
          <FloatingLabelInput
            control={control}
            name='confirmPassword'
            label='Confirm Password'
            placeholder='Confirm Password'
          />
          {errors.confirmPassword && (
            <ErrorMessage message={errors.confirmPassword.message!} />
          )}
        </View>

        {/* Agree to Terms */}
        <View
          style={{
            // padding: 5,
            gap: 4,
            marginBottom: 20,
          }}
        >
          <Controller
            control={control}
            name='agreeToTerms'
            render={({ field: { onChange, value } }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <IconButton
                  onPress={() => onChange(!value)}
                  icon={value ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  color={value ? colors.primary : colors['gray-400']}
                />
                <Text
                  style={{
                    color: colors['gray-700'],
                    fontSize: 16,
                  }}
                >
                  Agree to our the{' '}
                  <Text
                    style={{
                      color: colors.blue,
                      textDecorationLine: 'underline',
                    }}
                  >
                    terms and conditions
                  </Text>{' '}
                  to continue.
                </Text>
              </View>
            )}
          />
          {errors.agreeToTerms && (
            <ErrorMessage message={errors.agreeToTerms.message!} />
          )}
        </View>
        {/* Submit Button */}
        <TextButton onPress={handleSubmit(onSubmit)} title='Sign Up' />
      </View>
    </ScrollView>
  );
}

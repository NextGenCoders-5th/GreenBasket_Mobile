import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View, ScrollView, Image } from 'react-native';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useColorTheme } from '@/hooks/useColorTheme';
import FloatingLabelInput from './FloatingLableInput';
import ErrorMessage from './ErrorMessage';
import { IconButton } from '../IconButton';
import TextButton from '../TextButton';
import PhoneNumberInput from './PhoneNumberInput';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { router } from 'expo-router';

const phoneNumberValidator = yup
  .string()
  .test('is-valid-phone', 'Invalid phone number', (value) => {
    if (!value) return false;
    const phoneNumber = parsePhoneNumberFromString(value);
    return phoneNumber?.isValid() || false;
  });

const SignUpschema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address')
    .matches(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      'Invalid email address'
    ),

  phoneNumber: phoneNumberValidator.required('Phone number is required'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),

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
  const colors = useColorTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(SignUpschema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: FormData) => {
    // Alert.alert('Form Data', JSON.stringify(data, null, 2));
    console.log('data', data);
  };

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
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            color: colors['gray-800'],
            fontFamily: 'Inter',
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
          <PhoneNumberInput
            control={control}
            name='phoneNumber'
            label='Phone number'
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
            label='Confirm password'
            placeholder='Confirm password'
          />
          {errors.confirmPassword && (
            <ErrorMessage message={errors.confirmPassword.message!} />
          )}
        </View>
        {/* Agree to Terms */}
        <View
          style={{
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
                    fontSize: 14,
                    fontFamily: 'Inter',
                    fontWeight: '300',
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
        <TextButton
          onPress={handleSubmit(onSubmit)}
          title='Sign Up'
          style={{
            width: '100%',
          }}
        />
        <View style={{ width: '100%', marginTop: 10, alignItems: 'center' }}>
          <Text
            style={{
              color: colors['gray-600'],
              fontSize: 14,
              fontFamily: 'Inter',
              fontWeight: '300',
              alignSelf: 'flex-end',
            }}
          >
            Already have an account?
            <TextButton
              title='Sign in'
              onPress={() => router.navigate('/signin')}
              style={{
                paddingVertical: 0,
                paddingHorizontal: 5,
                margin: 0,
                borderRadius: 0,
                backgroundColor: 'transparent',
              }}
              titleStyle={{
                fontSize: 14,
                color: colors.primary,
                textDecorationLine: 'underline',
                textDecorationColor: colors.primary,
              }}
            />
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

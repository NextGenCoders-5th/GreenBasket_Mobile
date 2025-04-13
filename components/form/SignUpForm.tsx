import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View, ScrollView, Image, StyleSheet } from 'react-native';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useColorTheme } from '@/hooks/useColorTheme';
import FloatingLabelInput from './FloatingLableInput';
import { IconButton } from '../IconButton';
import TextButton from '../TextButton';
import PhoneNumberInput from './PhoneNumberInput';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { router } from 'expo-router';
import ErrorMessage from './ErrorMessage';
import { useSignUpMutation } from '@/redux/api/userApi';

const phoneNumberValidator = yup
  .string()
  .test('is-valid-phone', 'Invalid phone number', (value) => {
    if (!value) return false;
    const phoneNumber = parsePhoneNumberFromString(value);
    return phoneNumber?.isValid() || false;
  });

const SignUpschema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address')
    .matches(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      'Invalid email address'
    ),

  phoneNumber: yup.string().required('Phone number is required'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),

  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm your password'),

  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required(),
});

type FormData = {
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
  agreeToTerms: boolean;
};

export default function SignUpForm() {
  const colors = useColorTheme();
  const [signup, { isLoading }] = useSignUpMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(SignUpschema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      password: '',
      passwordConfirm: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    // Alert.alert('Form Data', JSON.stringify(data, null, 2));

    console.log('data', data);

    const { email, phoneNumber, password, passwordConfirm } = data;

    try {
      const response = await signup({
        email,
        phoneNumber,
        password,
        passwordConfirm,
      }).unwrap();

      console.log('response', response);
    } catch (error: any) {
      // alert('Error', error.message);
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image source={require('@/assets/images/react-logo.png')} />

      <View
        style={{
          ...styles.subContainer,
          borderColor: colors['gray-300'],
        }}
      >
        <Text
          style={{ ...styles.createAccountText, color: colors['gray-800'] }}
        >
          Create account
        </Text>

        {/* Email */}
        <View style={styles.inputContainer}>
          <FloatingLabelInput
            control={control}
            name='email'
            label='Email'
            placeholder='Email'
            // icon='email'
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          {/* <PhoneNumberInput
            control={control}
            name='phoneNumber'
            label='Phone number'
          /> */}
          <FloatingLabelInput
            control={control}
            name='phoneNumber'
            label='Phone Number'
            placeholder='Phone Number'
            // icon='call'
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <FloatingLabelInput
            control={control}
            name='password'
            label='Password'
            placeholder='Password'
            // icon='lock'
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <FloatingLabelInput
            control={control}
            name='passwordConfirm'
            label='Confirm password'
            placeholder='Confirm password'
            // icon='lock'
          />
        </View>

        {/* Agree to Terms */}
        <View
          style={{
            ...styles.inputContainer,
            padding: 0,
            marginBottom: 20,
          }}
        >
          <Controller
            control={control}
            name='agreeToTerms'
            render={({ field: { onChange, value } }) => (
              <View>
                <View style={styles.termsContainer}>
                  <IconButton
                    onPress={() => onChange(!value)}
                    icon={value ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    color={value ? colors.primary : colors['gray-400']}
                  />
                  <Text
                    style={{
                      ...styles.termsText,
                      color: colors['gray-700'],
                    }}
                  >
                    Agree to our{' '}
                    <Text
                      style={{
                        color: colors.primary,
                        textDecorationLine: 'underline',
                      }}
                    >
                      terms and conditions
                    </Text>{' '}
                    to continue.
                  </Text>
                </View>
                {errors.agreeToTerms && (
                  <ErrorMessage message={errors.agreeToTerms.message!} />
                )}
              </View>
            )}
          />
        </View>

        {/* Submit Button */}
        <TextButton
          onPress={handleSubmit(onSubmit)}
          title='Sign Up'
          style={{
            width: '100%',
          }}
          titleStyle={{
            color: colors['gray-50'],
          }}
          disabled={isLoading}
        />
        <View style={styles.haveAccountContainer}>
          <Text
            style={{ ...styles.haveAccountText, color: colors['gray-600'] }}
          >
            Already have an account?
          </Text>
          <TextButton
            title='Sign in'
            onPress={() => router.navigate('/signin')}
            style={styles.signinButton}
            titleStyle={{
              ...styles.signinTitle,
              color: colors.primary,
              textDecorationColor: colors.primary,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
  },
  subContainer: {
    display: 'flex',
    gap: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  createAccountText: {
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '700',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    padding: 5,
    gap: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '300',
    flex: 1,
  },
  haveAccountContainer: {
    width: '100%',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  haveAccountText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '300',
  },
  signinButton: {
    paddingVertical: 0,
    paddingHorizontal: 2,
    margin: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  signinTitle: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

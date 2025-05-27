import {
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';

import FloatingLabelInput from '@/components/form/FloatingLableInput';
import { IconButton } from '@/components/ui/IconButton';
import TextButton from '@/components/ui/TextButton';
import PhoneNumberInput from '@/components/form/PhoneNumberInput';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { SignUpschema } from '@/utils/validators';
import { SignUpFormType } from '@/types/auth';
import { useColorTheme } from '@/hooks/useColorTheme';
import { useAuth } from '@/hooks/useAuth';

export default function SignUpScreen() {
  const colors = useColorTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormType>({
    resolver: yupResolver(SignUpschema),
    defaultValues: {
      email: 'test@test.com',
      phoneNumber: '912345678',
      password: 'password123',
      passwordConfirm: 'password123',
      agreeToTerms: true,
    },
  });

  const { signUp, isSignUpLoading } = useAuth();

  const onSubmit = async (formData: SignUpFormType) => {
    const { email, phoneNumber, password, passwordConfirm } = formData;
    const { success, error } = await signUp({
      email,
      phoneNumber,
      password,
      passwordConfirm,
    });

    if (success) {
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Welcome👋',
        text2: 'You registered successfully',
        text1Style: {
          color: colors.primary,
          fontFamily: 'Inter',
          fontWeight: '700',
          fontSize: 18,
        },
        text2Style: {
          color: colors['gray-600'],
          fontFamily: 'Inter',
          fontWeight: '400',
          fontSize: 12,
        },
      });
      router.replace('/(tabs)/home');
    } else {
      Toast.show({
        type: 'error',
        visibilityTime: 4000,
        text1: 'Sign up failed',
        text2: error || 'User with this email or phone number already exists',
        text1Style: {
          color: colors.red,
          fontFamily: 'Inter',
          fontWeight: '700',
          fontSize: 18,
        },
        text2Style: {
          color: colors['gray-600'],
          fontFamily: 'Inter',
          fontWeight: '400',
          fontSize: 12,
          wordWrap: 'wrap',
        },
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors['primary-50'],
      }}
    >
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
            <PhoneNumberInput
              control={control}
              name='phoneNumber'
              label='Phone number'
              placeholder='9/7xxxxxxxx'
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
                      icon={
                        value ? 'checkbox-marked' : 'checkbox-blank-outline'
                      }
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
            disabled={isSignUpLoading}
            isLoading={isSignUpLoading}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '100%',
  },
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

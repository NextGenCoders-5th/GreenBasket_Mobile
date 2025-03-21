import { View, Text, Image } from 'react-native';
import React from 'react';
import { useColorTheme } from '@/hooks/useColorTheme';
import FloatingLabelInput from './FloatingLableInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ErrorMessage from './ErrorMessage';
import TextButton from '../TextButton';
import { router } from 'expo-router';

const SingInSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      'Invalid email address'
    ),
  password: yup.string().required('Password is required'),
});

type FormData = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const colors = useColorTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(SingInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <View
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        padding: 20,
        width: '100%',
        minHeight: '100%',
      }}
    >
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
            fontFamily: 'Inter',
            fontWeight: '700',
            marginBottom: 10,
          }}
        >
          Sign in
        </Text>
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
        <TextButton
          style={{
            padding: 0,
            margin: 0,
            borderRadius: 0,
            alignSelf: 'flex-end',
            backgroundColor: 'transparent',
            marginBottom: 10,
          }}
          onPress={() => {
            console.log('Forgot password');
          }}
          title='Forgot password?'
          titleStyle={{
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: '600',
            color: colors.primary,
            textDecorationLine: 'underline',
            textDecorationColor: colors.primary,
          }}
        />
        <TextButton
          title='Sign in'
          onPress={handleSubmit(onSubmit)}
          style={{ width: '100%' }}
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
            Don't have an account?
            <TextButton
              title='Sign up'
              onPress={() => router.navigate('/signup')}
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
    </View>
  );
}

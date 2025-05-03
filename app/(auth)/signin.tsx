import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { yupResolver } from '@hookform/resolvers/yup';

import { useColorTheme } from '@/hooks/useColorTheme';
import FloatingLabelInput from '@/components/form/FloatingLableInput';
import TextButton from '@/components/ui/TextButton';
import { shadows } from '@/styles/shadows';
import { useSignInMutation } from '@/redux/api/authApi';
import { AuthSignInType } from '@/types/auth';
import { SingInSchema } from '@/utils/validators';

export default function SignIn() {
  const colors = useColorTheme();
  const [singIn, { isLoading }] = useSignInMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AuthSignInType>({
    resolver: yupResolver(SingInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AuthSignInType) => {
    // console.log(data);
    const { email, password } = data;
    try {
      const response = await singIn({
        email,
        password,
      }).unwrap();

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Welcome👋',
        text2: 'You have successfully logged in',
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
      console.log('response', response);
      router.replace('/(tabs)');
    } catch (error) {
      Toast.show({
        type: 'error',
        visibilityTime: 4000,
        text1: 'Error',
        text2: 'Invalid email or password',
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
        },
      });

      // console.log(error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={colors['primary-600']} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors['primary-50'] }}>
      <View style={styles.container}>
        <Image source={require('@/assets/images/react-logo.png')} />
        <View
          style={[styles.subContainer, { borderColor: colors['gray-300'] }]}
        >
          <Text style={[styles.signinText, { color: colors['gray-800'] }]}>
            Sign in
          </Text>
          <View style={styles.inputContainer}>
            <FloatingLabelInput
              control={control}
              name='email'
              label='Email'
              placeholder='Email'
              icon='email'
            />
          </View>
          <View style={styles.inputContainer}>
            <FloatingLabelInput
              control={control}
              name='password'
              label='Password'
              placeholder='Password'
              icon='lock'
            />
          </View>
          <TextButton
            style={styles.signinButton}
            onPress={() => {
              console.log('Forgot password');
            }}
            title='Forgot password?'
            titleStyle={{
              ...styles.titleStyle,
              color: colors.primary,
              textDecorationColor: colors.primary,
            }}
          />
          <TextButton
            title='Sign in'
            onPress={handleSubmit(onSubmit)}
            style={{ width: '100%' }}
            titleStyle={{
              color: colors['gray-50'],
            }}
            disabled={isLoading}
          />
          <View style={styles.noAccountContainer}>
            <Text
              style={{ ...styles.noAccountText, color: colors['gray-600'] }}
            >
              Don't have an account?
            </Text>
            <TextButton
              title='Sign up'
              onPress={() => router.navigate('/signup')}
              style={styles.signupButton}
              titleStyle={{
                ...styles.signupTitle,
                color: colors.primary,
                textDecorationColor: colors.primary,
              }}
            />
          </View>
        </View>
      </View>
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
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    padding: 20,
    width: '100%',
    minHeight: '100%',
  },
  subContainer: {
    display: 'flex',
    gap: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    boxShadow: shadows['shadow-1'],
  },
  signinText: {
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
  signinButton: {
    padding: 0,
    margin: 0,
    borderRadius: 0,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  titleStyle: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  noAccountContainer: {
    width: '100%',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  noAccountText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '300',
  },
  signupButton: {
    paddingVertical: 0,
    paddingHorizontal: 2,
    margin: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  signupTitle: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

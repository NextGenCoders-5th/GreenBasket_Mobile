import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  TextInput,
  Button,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme';

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
    Alert.alert('Form Data', JSON.stringify(data, null, 2));
  };

  return (
    <View
      style={{
        width: 250,
        marginHorizontal: 'auto',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>OUR LOGO</Text>

      <View>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Create account</Text>
        {/* First Name */}
        <Controller
          control={control}
          name='firstName'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='First Name'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{
                borderWidth: 1,
                borderColor: colors.primary,
                marginBottom: 10,
                padding: 10,
              }}
            />
          )}
        />
        {errors.firstName && (
          <Text style={{ color: 'red' }}>{errors.firstName.message}</Text>
        )}

        {/* Last Name */}
        <Controller
          control={control}
          name='lastName'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Last Name'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
            />
          )}
        />
        {errors.lastName && (
          <Text style={{ color: 'red' }}>{errors.lastName.message}</Text>
        )}

        {/* Username */}
        <Controller
          control={control}
          name='username'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Username'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
            />
          )}
        />
        {errors.username && (
          <Text style={{ color: 'red' }}>{errors.username.message}</Text>
        )}

        {/* Email */}
        <Controller
          control={control}
          name='email'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Email'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType='email-address'
              autoCapitalize='none'
              style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
            />
          )}
        />
        {errors.email && (
          <Text style={{ color: 'red' }}>{errors.email.message}</Text>
        )}

        {/* Phone Number */}
        <Controller
          control={control}
          name='phoneNumber'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Phone Number'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType='phone-pad'
              style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
            />
          )}
        />
        {errors.phoneNumber && (
          <Text style={{ color: 'red' }}>{errors.phoneNumber.message}</Text>
        )}

        {/* Password */}
        <Controller
          control={control}
          name='password'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Password'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
            />
          )}
        />
        {errors.password && (
          <Text style={{ color: 'red' }}>{errors.password.message}</Text>
        )}

        {/* Confirm Password */}
        <Controller
          control={control}
          name='confirmPassword'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Confirm Password'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={{ color: 'red' }}>{errors.confirmPassword.message}</Text>
        )}

        {/* Agree to Terms */}
        <Controller
          control={control}
          name='agreeToTerms'
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity
              onPress={() => onChange(!value)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                gap: 10,
              }}
            >
              <MaterialCommunityIcons
                name={value ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={22}
                color={colors['gray-700']}
              />
              <Text style={{}}>I agree to the terms and conditions</Text>
            </TouchableOpacity>
          )}
        />
        {errors.agreeToTerms && (
          <Text style={{ color: 'red' }}>{errors.agreeToTerms.message}</Text>
        )}

        {/* Submit Button */}
        <Button title='Sign Up' onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}

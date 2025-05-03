import parsePhoneNumberFromString from 'libphonenumber-js';
import * as yup from 'yup';

export const SingInSchema = yup.object({
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

const ethiopianPhoneRegex = /^[79]\d{8}$/;

export const SignUpschema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address')
    .matches(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      'Invalid email address'
    ),

  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .length(9, 'Please enter exactly 9 digits')
    .matches(
      ethiopianPhoneRegex,
      'Enter a valid phone number (starting with 9 or 7)'
    ),

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

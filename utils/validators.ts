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

export const phoneNumberValidator = yup
  .string()
  .test('is-valid-phone', 'Invalid phone number', (value) => {
    if (!value) return false;
    const phoneNumber = parsePhoneNumberFromString(value);
    return phoneNumber?.isValid() || false;
  });

export const SignUpschema = yup.object({
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

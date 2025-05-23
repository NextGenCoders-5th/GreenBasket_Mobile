import { Gender } from '@/config/enums';
import { isValid as isValidDateFns, parseISO } from 'date-fns';
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

const GENDER_OPTIONS: Gender[] = [Gender.MALE, Gender.FEMALE];
const pickedImageObjectSchema = yup
  .object()
  .shape({
    uri: yup.string().required('Please select an image file.'),
    type: yup.string().optional(),
    name: yup.string().optional(),
  })
  .nonNullable();

export const OnboardingSchema = yup.object({
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  date_of_birth: yup
    .string()
    .required('Date of birth is required')
    .test(
      'is-iso-date',
      'Invalid date format. Please select a valid date.',
      (value) => {
        if (!value) return false;
        const date = parseISO(value);
        return isValidDateFns(date);
      }
    )
    .test(
      'is-not-future-date',
      'Date of birth cannot be in the future.',
      (value) => {
        if (!value) return true;
        const date = parseISO(value);
        if (!isValidDateFns(date)) return true;
        return date <= new Date();
      }
    ),
  gender: yup
    .mixed<Gender>()
    .oneOf(GENDER_OPTIONS, 'Invalid gender selection')
    .required('Gender is required'),

  profile_picture: pickedImageObjectSchema.required(
    'Profile picture is required.'
  ),
  idPhoto_front: pickedImageObjectSchema.required(
    'Front of ID photo is required.'
  ),
  idPhoto_back: pickedImageObjectSchema.required(
    'Back of ID photo is required.'
  ),
});

export const AddressSchema = yup.object({
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
  sub_city: yup.string().required('Sub City is required'),
  street: yup.string().required('Street address is required'),
  zip_code: yup.string().required('Zip Code is required'),
  latitude: yup.number().optional().nullable(),
  longitude: yup.number().optional().nullable(),
});

export type AddressFormData = yup.InferType<typeof AddressSchema>;

export const passwordUpdateSchema = yup.object().shape({
  oldPassword: yup.string().required('Current password is required'),
  password: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long')
    // Add more password strength criteria if needed (e.g., uppercase, number, symbol)
    // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .matches(/[0-9]/, 'Password must contain at least one number')
    // .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol')
    .notOneOf(
      [yup.ref('oldPassword')],
      'New password cannot be the same as the current password'
    ), // Ensure new password is different
  passwordConfirm: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'), // Ensure passwords match
});

export type PasswordUpdateFormData = yup.InferType<typeof passwordUpdateSchema>;

import {
  AuthProvider,
  Gender,
  UserRole,
  UserStatus,
  UserVerifyStatus,
} from '@/config/enums';
import { Vendor } from './vendor';
import { Address } from './address';
import { Cart } from './cart';
import { PickedImage } from '@/components/form/ImagePickerButton';
import { Review } from './Review';
import { Order } from './order';

export type User = {
  id: string;
  updatedAt: string;
  createdAt: string;

  first_name?: string;
  last_name?: string;
  email: string;
  phone_number: string;
  password: string;
  profile_picture?: string;
  role: UserRole;
  status: UserStatus;
  authProvider: AuthProvider;
  is_onboarding: boolean;
  need_reset_password: boolean;

  vendor?: Vendor;
  address?: Address;
  orders?: Order[];
  cart: Cart[];
  Review?: Review[];

  date_of_birth?: string;
  gender?: string;
  idPhoto_front?: string;
  idPhoto_back?: string;
  verify_status?: UserVerifyStatus;
  reset_password_token?: string;
  reset_password_token_expires_at?: string;
};

export type UpdateUserPasswordDto = {
  oldPassword: string;
  password: string;
  passwordConfirm: string;
};

export type UpdateCurrentUserDataDto = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  date_of_birth: string;
  gender: Gender;
};

export interface UpdateProfilePictureDto {
  profile_picture: PickedImage;
}

export type CompleteOnboardingDto = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  profile_picture: PickedImage;
  idPhoto_front: PickedImage;
  idPhoto_back: PickedImage;
};

export type ApiResponse<T> = {
  apiVersion: string;
  data: {
    status: 'success' | 'error';
    message: string;
    timestamp: string;
    data: T;
  };
};

export type GetCurrentUserResponse = ApiResponse<User>;
export type UpdateProfilePictureResponse = ApiResponse<User>;
export type UpdateCurrentUserResponse = ApiResponse<User>;
export type UpdatePasswordResponse = ApiResponse<User>;
export type CompleteOnboardingResponse = ApiResponse<User>;
export type RequestAccountVerificationResponse = ApiResponse<null>;

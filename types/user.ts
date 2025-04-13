import { AuthProvider, UserRole, UserStatus } from '@/constants/enums';
import { VendorType } from './vendor';
import { AddressType } from './address';
import { OrderType } from './order';
import { CartType } from './cart';

export interface UserType {
  id: string;
  updatedAt: string;
  createdAt: string;

  first_name?: string | null;
  last_name?: string | null;
  email: string;
  phone_number: string;
  password: string;
  profile_picture?: string | null;
  role: UserRole;
  status: UserStatus;
  authProvider: AuthProvider;
  is_onboarding: boolean;
  need_reset_password: boolean;

  vendor?: VendorType | null;
  address?: AddressType | null;
  orders: OrderType[];
  carts: CartType[];
}

export interface UserSignUpType {
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
}

export interface UserSignUpResponseType {
  data: {
    status: string;
    message: string;
    timestamp: string;

    data: UserType;
  };
}

export interface UserSignInType {
  email: string;
  password: string;
}

export interface UserSignInResponseType {
  data: {
    status: string;
    message: string;
    timestamp: string;

    data: {
      accessToken: string;
      refreshToken: string;
      data: {
        accessToken: string;
        refreshToken: string;
        user: UserType;
      };
    };
  };
}

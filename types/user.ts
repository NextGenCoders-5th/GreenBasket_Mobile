import { AuthProvider, UserRole, UserStatus } from '@/config/enums';
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

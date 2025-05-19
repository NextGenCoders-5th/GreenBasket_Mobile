import { VendorStatus } from '@/config/enums';
import { UserType } from './user';
import { AddressType } from './address';
import { Product } from './product';
import { OrderType } from './order';

export interface VendorType {
  id: string;
  updatedAt: string;
  createdAt: string;
  business_name: string;
  business_email: string;
  phone_number: string;
  logo_url?: string | null;
  status: VendorStatus;

  user: UserType;
  userId: string;
  address: AddressType[];
  products: Product[];
  orders: OrderType[];
}

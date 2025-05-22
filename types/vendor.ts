import { VendorStatus } from '@/config/enums';
import { User } from './user';
import { Address } from './address';
import { Product } from './product';
import Order from './order';

export interface Vendor {
  id: string;
  updatedAt: string;
  createdAt: string;
  business_name: string;
  business_email: string;
  phone_number: string;
  logo_url?: string | null;
  status: VendorStatus;

  user: User;
  userId: string;
  address: Address[];
  products: Product[];
  orders: Order[];
}

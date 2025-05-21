import { Order } from './order';
import { User } from './user';
import { Vendor } from './vendor';

export interface Address {
  id: string;
  updatedAt: string;
  createdAt: string;
  street: string;
  city: string;
  sub_city: string;
  zip_code: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  is_default: boolean;

  vendor?: Vendor | null;
  vendorId?: string | null;
  Order: Order[];
  User?: User | null;
  userId?: string | null;
}

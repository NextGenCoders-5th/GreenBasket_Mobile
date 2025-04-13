import { OrderType } from './order';
import { UserType } from './user';
import { VendorType } from './vendor';

export interface AddressType {
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

  vendor?: VendorType | null;
  vendorId?: string | null;
  Order: OrderType[];
  User?: UserType | null;
  userId?: string | null;
}

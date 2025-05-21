import { OrderStatus } from '@/config/enums';
import { OrderItemType } from './orderItem';
import { PaymentType } from './payment';
import { User } from './user';
import { Vendor } from './vendor';
import { Address } from './address';

export interface Order {
  id: string;
  updatedAt: string;
  createdAt: string;
  total_price: number;
  status: OrderStatus;

  OrderItems: OrderItemType[];
  Payment?: PaymentType | null;
  User: User;
  userId: string;
  Vendor: Vendor;
  vendorId: string;
  Adress: Address;
  addressId: string;
}

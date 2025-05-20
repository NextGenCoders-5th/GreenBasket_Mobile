import { OrderStatus } from '@/config/enums';
import { OrderItemType } from './orderItem';
import { PaymentType } from './payment';
import { User } from './user';
import { VendorType } from './vendor';
import { AddressType } from './address';

export interface OrderType {
  id: string;
  updatedAt: string;
  createdAt: string;
  total_price: number;
  status: OrderStatus;

  OrderItems: OrderItemType[];
  Payment?: PaymentType | null;
  User: User;
  userId: string;
  Vendor: VendorType;
  vendorId: string;
  Adress: AddressType;
  addressId: string;
}

import { OrderStatus } from '@/constants/enums';
import { OrderItemType } from './orderItem';
import { PaymentType } from './payment';
import { UserType } from './user';
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
  User: UserType;
  userId: string;
  Vendor: VendorType;
  vendorId: string;
  Adress: AddressType;
  addressId: string;
}

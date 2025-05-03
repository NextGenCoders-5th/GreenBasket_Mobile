import { PaymentStatus } from '@/config/enums';
import { OrderType } from './order';

export interface PaymentType {
  id: string;
  updatedAt: string;
  createdAt: string;
  amount: string;
  status: PaymentStatus;

  Order: OrderType;
  orderId: string;
}

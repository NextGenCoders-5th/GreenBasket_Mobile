import { PaymentStatus } from '@/config/enums';
import { Order } from './order';

export interface PaymentType {
  id: string;
  updatedAt: string;
  createdAt: string;
  amount: string;
  status: PaymentStatus;

  Order: Order;
  orderId: string;
}

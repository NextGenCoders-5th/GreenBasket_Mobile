import { CartStatus } from '@/constants/enums';
import { CartItemType } from './cartItem';
import { UserType } from './user';

export interface CartType {
  id: string;
  updatedAt: string;
  createdAt: string;
  total_price: number;
  status: CartStatus;

  CartItems: CartItemType[];
  User: UserType;
  userId: string;
}

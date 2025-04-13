import { CartType } from './cart';

export interface CartItemType {
  id: string;
  updatedAt: string;
  createdAt: string;
  price: number;
  quantity: number;
  sub_total: number;

  Cart: CartType;
  cartId: string;
}

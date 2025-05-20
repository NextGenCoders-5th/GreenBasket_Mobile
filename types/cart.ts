import { CartStatus } from '@/config/enums';
import { Product } from './product';

export type Cart = {
  id: string;
  createdAt: string;
  updatedAt: string;
  total_price: number;
  status: CartStatus;
  userId: string;
  CartItems: CartItem[];
};

export interface CreateCartItemDto {
  productId: string;
  quantity: number;
}

export type ApiResponse<T> = {
  apiVersion: string;
  data: {
    status: 'success' | 'fail' | 'error';
    message: string;
    timestamp: string;
    data: T;
  };
};

export type CartItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  quantity: number;
  sub_total: number;
  productId: string;
  cartId: string;
  Product?: Product;
};

export type CreateCartItemResponse = ApiResponse<CartItem>;
export type GetMyCartResponse = ApiResponse<Cart>;

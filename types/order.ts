import { OrderStatus } from '@/config/enums';
import { Address } from './address';
import { Product } from './product';

export type OrderItem = {
  id: string;
  updatedAt: string;
  createdAt: string;
  price: number;
  quantity: number;
  sub_total: number;
  reviewed: boolean;
  orderId: string;
  productId: string;
  Product?: Product;
};

export interface Order {
  id: string;
  updatedAt: string;
  createdAt: string;
  total_price: number;
  status: OrderStatus;
  shippedAt: string | null;
  deliveredAt: string | null;
  receivedAt: string | null;
  cartId: string;
  userId: string;
  vendorId: string;
  addressId: string;
  Adress: Address;
  OrderItems: OrderItem[];
}

export interface CheckoutDto {
  addressId: string;
  cartId: string;
}

export interface ApiResponse<T> {
  apiVersion: string;
  data: {
    status: string;
    message: string;
    timestamp: string;
    data: T;
  };
}

export type CreateOrderResponse = ApiResponse<Order[]>;

export type GetMyOrdersResponse = ApiResponse<Order[]>;

export type GetMyOrderByIdResponse = ApiResponse<Order>;

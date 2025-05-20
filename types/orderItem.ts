import { OrderType } from './order';
import { Product } from './product';

export interface OrderItemType {
  id: string;
  updatedAt: string;
  createdAt: string;
  price: number;
  quantity: number;
  sub_total: number;

  Order: OrderType;
  orderId: string;
  Product: Product;
  productId: string;
}

import { OrderType } from './order';
import { ProductType } from './product';

export interface OrderItemType {
  id: string;
  updatedAt: string;
  createdAt: string;
  price: number;
  quantity: number;
  sub_total: number;

  Order: OrderType;
  orderId: string;
  Product: ProductType;
  productId: string;
}

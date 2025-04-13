import { CategoryStatus, ProductStatus } from '@/constants/enums';
import { VendorType } from './vendor';
import { OrderItemType } from './orderItem';

export interface ProductType {
  id: string;
  updatedAt: string;
  createdAt: string;
  name: string;
  description: string;
  price: number;
  descount_price?: number | null;
  unit: string;
  stock: number;
  image_url: string;
  status: ProductStatus;

  Vendor: VendorType;
  vendorId: string;
  categories: CategoryType[];
  OrderItems: OrderItemType[];
}

interface CategoryType {
  id: string;
  updatedAt: Date;
  createdAt: Date;
  name: string;
  slug: string;
  image_url?: string | null;
  status: CategoryStatus;

  products: ProductType[];
}

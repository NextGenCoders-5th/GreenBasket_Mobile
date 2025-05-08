import { CategoryStatus, ProductStatus } from '@/config/enums';
import { OrderItemType } from './orderItem';

export interface CategoryType {
  id: string;
  updatedAt: string;
  createdAt: string;
  name: string;
  slug: string;
  image_url: string;
  status: CategoryStatus;
  products?: ProductType[];
}

export interface ProductType {
  id: string;
  updatedAt: string;
  createdAt: string;
  name: string;
  description: string;
  price: number;
  discount_price: number;
  unit: string;
  stock: number;
  image_url: string;
  status: ProductStatus;
  is_featured: boolean;

  vendorId: string;
  categories: CategoryType[];
  OrderItems: OrderItemType[];
}

// Product with categories
export interface ProductWithCategories extends ProductType {
  categories: CategoryType[];
}

// Metadata for paginated responses
export interface Metadata {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// API Response Envelopes
export interface ApiResponseEnvelope<T> {
  apiVersion: string;
  data: {
    status: string;
    message: string;
    timestamp: string;
    data: T;
    metadata?: Metadata;
  };
}

// ==============================
// Request Payload Types
// ==============================

// query parameters for getProducts
export interface GetProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string; // e.g., 'price_asc', 'name_desc'
  filterByCategory?: string; // categoryId
  search?: string;
}

//create new product
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  unit: string;
  stock: number;
  image_url: string;
  is_featured?: boolean;
  vendorId: string;
  categoryIds: string[];
}

// update product
export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  discount_price?: number;
  unit?: string;
  stock?: number;
  image_url?: string;
  is_featured?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  vendorId?: string;
  categoryIds?: string[];
}

// ==============================
// API Response Types
// ==============================

// Single product response
export type ProductDetailResponse = ApiResponseEnvelope<ProductType>;

// Multiple products response
export type ProductListResponse = ApiResponseEnvelope<ProductType[]>;

// Create product response
export type CreateProductResponse = ApiResponseEnvelope<ProductWithCategories>;

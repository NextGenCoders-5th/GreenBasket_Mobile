import { CategoryStatus, ProductStatus } from '@/config/enums';

export interface Category {
  id: string;
  updatedAt: string;
  createdAt: string;
  name: string;
  slug: string;
  image_url: string;
  status: CategoryStatus;
  products?: Product[];
}

export interface Product {
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
}

// Product with categories
export interface ProductWithCategories extends Product {
  categories: Category[];
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
  status?: ProductStatus;
  vendorId?: string;
  categoryIds?: string[];
}

// ==============================
// API Response Types
// ==============================

// Single product response
export type ProductDetailResponse = ApiResponseEnvelope<Product>;

// Multiple products response
export type ProductListResponse = ApiResponseEnvelope<Product[]>;

// Create product response
export type CreateProductResponse = ApiResponseEnvelope<ProductWithCategories>;

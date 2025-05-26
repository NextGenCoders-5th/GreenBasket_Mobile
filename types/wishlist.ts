import { Product } from './product';

export interface WishlistItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
  userId: string;
}

export interface ApiResponse<T> {
  apiVersion: string;
  data: T;
}

export interface WishlistWithProduct extends WishlistItem {
  Product: Product;
}

export type AddToWishlistResponse = ApiResponse<WishlistItem>;
export type GetWishlistsResponse = ApiResponse<WishlistWithProduct[]>;
export type DeleteWishlistResponse = ApiResponse<WishlistItem>;

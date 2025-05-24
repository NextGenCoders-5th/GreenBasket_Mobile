import { CategoryStatus } from '@/config/enums';

export interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  image_url: string;
  status: CategoryStatus;
}

export type CreateCategoryDto = {
  name?: string;
  image?: string;
};

export interface ApiResponse<T> {
  apiVersion: string;
  data: {
    status: string;
    message: string;
    timestamp: string;
    data: T;
    metadata?: Record<string, any>;
  };
}

export type CreateCategoryResponse = ApiResponse<Category>;
export type GetAllCategoriesResponse = ApiResponse<Category[]>;
export type GetCategoryByIdResponse = ApiResponse<Category>;
export type UpdateCategoryByIdResponse = ApiResponse<null>;
export type DeleteCategoryByIdResponse = void;

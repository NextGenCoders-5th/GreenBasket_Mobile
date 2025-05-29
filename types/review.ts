import { OrderItem } from './order';

export type Review = {
  id: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  comment: string;
  userId: string;
  orderItemId: string;
  OrderItem?: OrderItem;
};

export type CreateReviewDto = {
  orderItemId: string;
  rating: number;
  comment: string;
};

export type UpdateteReviewDto = {
  orderItemId: string;
  rating: number;
  comment: string;
};

export type ApiResponse<T> = {
  apiVersion: string;
  data: {
    status: string;
    message: string;
    timestamp: string;
    data: T;
  };
};

export type GetReviewsByProductIdResponse = ApiResponse<Review[]>;
export type CreateReviewResponse = ApiResponse<Review>;
export type GetReviewByIdResponse = ApiResponse<Review>;
export type UpdateReviewResponse = ApiResponse<Review>;
export type DeleteReviewResponse = ApiResponse<null>;
export type GetMyReviewsResponse = ApiResponse<Review[]>;

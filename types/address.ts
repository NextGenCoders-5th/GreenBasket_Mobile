export interface Address {
  id: string;
  createdAt: string;
  updatedAt: string;

  street: string;
  city: string;
  sub_city: string;
  zip_code: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  is_default: boolean;

  vendorId: string | null;
  userId: string;
}

export type CreateAddressDto = {
  country: string;
  city: string;
  sub_city: string;
  street: string;
  zip_code: string;
  latitude?: number | null;
  longitude?: number | null;
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

export type CreateUserAddressResponse = ApiResponse<Address>;

export type GetUserAddressResponse = ApiResponse<Address>;

export type UpdateUserAddressResponse = ApiResponse<Address>;

export type UpdateUserAddressDto = Partial<CreateAddressDto>;

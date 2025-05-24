export interface Vendor {
  id: string;
  updatedAt: string;
  createdAt: string;
  business_name: string;
  business_email: string;
  phone_number: string;
  logo_url: string;
  status: string; // You can enum this if desired
  have_bank_details: boolean;
  userId: string;
}

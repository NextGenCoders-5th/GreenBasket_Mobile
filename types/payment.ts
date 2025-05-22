export type InitializePaymentDto = {
  orderId: string;
};

export type InitializePaymentResponse = {
  apiVersion: string;
  data: {
    status: string;
    message: string;
    data: {
      checkout_url: string;
    };
  };
};

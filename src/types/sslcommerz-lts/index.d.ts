declare module "sslcommerz-lts" {
  interface SSLCommerzPaymentOptions {
    init(data: any): Promise<any>;
  }

  interface SSLCommerzPaymentConstructor {
    new (
      storeId: string,
      storePassword: string,
      isLive: boolean,
    ): SSLCommerzPaymentOptions;
  }

  const SSLCommerzPayment: SSLCommerzPaymentConstructor;
  export default SSLCommerzPayment;
}

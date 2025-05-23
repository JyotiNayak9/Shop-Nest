declare module 'khalti-checkout-web' {
  interface KhaltiConfig {
    publicKey: string;
    productIdentity: string;
    productName: string;
    productUrl?: string;
    eventHandler: {
      onSuccess: (payload: any) => void;
      onError: (error: any) => void;
      onClose: () => void;
    };
    paymentPreference?: string[];
  }

  export default class KhaltiCheckout {
    constructor(config: KhaltiConfig);
    show(config: { amount: number }): void;
  }
}

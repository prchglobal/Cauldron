/**
 * Web stub for react-native-iap.
 * Allows Cauldron to compile and run in web browsers.
 */

export const initConnection = async (): Promise<boolean> => {
  console.log('[IAP Web Stub] Connection initialized');
  return true;
};

export const endConnection = async (): Promise<void> => {
  console.log('[IAP Web Stub] Connection ended');
};

export const getAvailablePurchases = async (): Promise<any[]> => {
  return [];
};

export const getProducts = async (_skus: { skus: string[] }): Promise<any[]> => {
  return [];
};

export const getSubscriptions = async (_skus: { skus: string[] }): Promise<any[]> => {
  return [];
};

export const requestPurchase = async (_params: any): Promise<any> => {
  console.log('[IAP Web Stub] requestPurchase simulated for web');
  return {
    productId: _params?.sku || _params?.skus?.[0],
    transactionId: 'web-sim-' + Date.now(),
    purchaseState: 'PurchasedState',
  };
};

export const requestSubscription = async (_params: any): Promise<any> => {
  console.log('[IAP Web Stub] requestSubscription simulated for web');
  return {
    productId: _params?.sku || _params?.skus?.[0],
    transactionId: 'web-sub-sim-' + Date.now(),
    purchaseState: 'PurchasedState',
  };
};

export const purchaseUpdatedListener = (_listener: (purchase: any) => void) => {
  return {
    remove: () => {},
  };
};

export const purchaseErrorListener = (_listener: (error: any) => void) => {
  return {
    remove: () => {},
  };
};

export const finishTransaction = async (_params: any): Promise<void> => {};
export const flushFailedPurchasesCachedAsPendingAndroid = async (): Promise<void> => {};

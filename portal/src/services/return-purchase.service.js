import httpClient from 'utils/httpClient.js';

const path = '/return-purchase';

export const getPurchaseOrdersOptions = (params = {}) => {
  return httpClient.get(`${path}/po-options`, { params });
};

export const getProductsOfPurchaseOrders = (params = {}) => {
  return httpClient.get(`${path}/po-products`, { params });
};

export const getStocksOptions = (params = {}) => {
  return httpClient.get(`${path}/stocks-options`, { params });
};

export const getPurchaseOrdersDetail = (params = {}) => {
  return httpClient.get(`${path}/po`, { params });
};

export const createInvoice = (params = {}) => {
  return httpClient.post(`${path}/invoice`, params);
};

export const getOrderInvoice = (params = {}) => {
  return httpClient.get(`${path}/invoice`, { params });
};

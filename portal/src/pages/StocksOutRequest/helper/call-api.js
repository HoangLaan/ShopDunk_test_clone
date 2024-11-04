import httpClient from 'utils/httpClient';

export const getOptionsOrders = (params = {}) => {
  return httpClient.get('/stocks-out-request/orders/get-options', { params });
};

export const getStocksTransferTypeByCode = (params = {}) => {
  return httpClient.get('/stocks-transfer/get-stocks-tranfer-by-code', { params });
};

import httpClient from 'utils/httpClient';

export const getListRequestPurchase = (params) => {
  return httpClient.get('/request-purchase-order', { params });
};

export const getListPRProduct = (payload) => {
  return httpClient.post('/request-purchase-order/pr-product', payload);
};

export const detailRequestPurchase = (id) => {
  return httpClient.get(`/request-purchase-order/${id}`);
};

export const createRequestPurchase = (payload) => {
  return httpClient.post('/request-purchase-order', payload);
};

export const updateRequestPurchase = (id, payload) => {
  return httpClient.put(`/request-purchase-order/${id}`, payload);
};

export const deleteRequestPurchase = (ids = []) => {
  return httpClient.post(`/request-purchase-order/delete`, { ids });
};

export const generateRequestPurchaseCode = (params) => {
  return httpClient.get('/request-purchase-order/generate-code', { params });
};

export const searchPurchaseRequisition = (payload) => {
  return httpClient.post('/request-purchase-order/purchase-requisition-search', payload);
};

export const printRequestPurchase = (id) => {
  return httpClient.post(`/request-purchase-order/${id}/print`);
};

// Get options
export const getOptionsDepartment = (params) => {
  return httpClient.get('/department/get-options', { params });
};

export const getOptionsStore = (params) => {
  return httpClient.get('/store/get-options', { params });
};

export const getOptionsPurchaseRequisition = (params) => {
  return httpClient.get('/purchase-requisition/get-options', { params });
};

export const getOrderHistory = (params) => {
  return httpClient.get('/request-purchase-order/order-history', { params });
};

export const detailRequestPurchaseByCode = (code = '') => {
  return httpClient.get(`/request-purchase-order/request-purchase-code/${code}`);
};

export const getListCountIsOrdered = (params) => {
  return httpClient.get('/request-purchase-order/count', { params });
};

export const detailRequestPurchaseByMulti = (params) => {
  return httpClient.post(`/request-purchase-order/multi-po`, params);
};

export const getUserReview = (params) => {
  return httpClient.get('/request-purchase-order/user-review', { params });
};

export const updateReview = (params = {}) => {
  return httpClient.post('/request-purchase-order/update-review', params);
};

export const getStoreOptions = (params = {}) => {
  return httpClient.post('/request-purchase-order/store-options', params);
};

export const getPriceNearly = (params) => {
  return httpClient.get('/request-purchase-order/price-nearly', { params });
};

export const purchaseSamSung = (bodyData) => {
  return httpClient.post('/request-purchase-order/purchase-samsung', bodyData);
};

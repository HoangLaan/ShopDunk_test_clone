import httpClient from 'utils/httpClient';
const path = '/purchase-orders';

export const getOptionsCompany = (_data = {}) => {
  return httpClient.get('/company/get-options', _data);
};

export const getOptionsBusiness = (params) => {
  return httpClient.get('/business/get-options', { params });
};

export const getOptionsStore = (params) => {
  return httpClient.get(`${path}/get-store-options`, { params });
};

export const getOptionsSupplier = (params) => {
  return httpClient.get('/supplier/get-options', { params });
};

export const genPurchaseOrderId = () => {
  return httpClient.get('/purchase-orders/get-id');
};

export const getListCustomer = (params) => {
  return httpClient.get('/account', { params });
};

export const getOptionsCustomer = (params) => {
  return httpClient.get(`${path}/list-customer/deboune`, { params });
};

export const getListPurchaseOrder = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getListCompanyOptions = (params) => {
  return httpClient.get('/announce/companies', { params });
};

export const getListDeparmentOptions = (params) => {
  return httpClient.get('/department/get-options', { params });
};

export const getListUserOptions = (params) => {
  return httpClient.get('/user', { params });
};

export const createPurchaseOrder = (payload) => {
  return httpClient.post(`${path}`, payload);
};

export const updatePurchaseOrder = (params) => {
  return httpClient.put(`${path}`, params);
};

export const deletePurchaseOrder = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getDetailPurchaseOrder = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const getOptionsAllStore = (params) => {
  return httpClient.get(`cluster/get-stores`, { params });
};

export const getListCountOrderStatus = (params = {}) => {
  return httpClient.get(`${path}/count`, { params });
};

export const getListRequestPurchaseOrderOptions = (params = {}) => {
  return httpClient.get(`${path}/request-purchase-order`, { params });
};

export const getCustomerOptions = (params) => {
  return httpClient.get(`${path}/customer-options`, { params });
};

export const getOrderOptions = (params) => {
  return httpClient.get(`${path}/order-options`, { params });
};

export const getProductsOfOrder = (params) => {
  return httpClient.get(`${path}/products-of-order`, { params });
};

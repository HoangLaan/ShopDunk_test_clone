import httpClient from 'utils/httpClient';

export const getListBusinessUser = (params = {}) => {
  return httpClient.get('/business-user', { params });
};

export const deleteBusinessUser = (items = {}) => {
  return httpClient.delete('/business-user', { data: { items } });
};

export const getListAllUser = (params = {}) => {
  let { company_id = null, business_id = null, search = '', page = 1, itemsPerPage = 5 } = params || {};
  return httpClient.get('/business-user/users', { params: { company_id, business_id, page, itemsPerPage, search } });
};

export const getUserOfBus = (businessId) => {
  return httpClient.get(`/business-user/users/${businessId}`);
};

export const getOptionsStore = (params) => {
  return httpClient.get('/store/get-options', { params });
};

export const createBusinessUser = (values) => {
  return httpClient.post(`/business-user`, values);
};

export const getStores = (params) => {
  return httpClient.get(`/business-user/store`, { params });
};

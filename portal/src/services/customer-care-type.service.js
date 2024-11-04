import httpClient from 'utils/httpClient.js';

export const getListCustomerCareType = (params = {}) => {
  return httpClient.get('/customer-care-type', { params });
};

export const getDetailCustomerCareType = (id) => {
  return httpClient.get(`/customer-care-type/${id}`);
};

export const createCustomerCareType = (params) => {
  return httpClient.post(`/customer-care-type`, params);
};

export const updateCustomerCareType = (id, params) => {
  return httpClient.put(`/customer-care-type/${id}`, params);
};

export const deleteCustomerCareType = (list_id = []) => {
  return httpClient.delete(`/customer-care-type`, { data: { list_id } });
};

export const getListUser = (params = {}) => {
  return httpClient.get('/customer-care-type/get-user', { params });
};

export const getListDepartment = (params = {}) => {
  return httpClient.get('/customer-care-type/get-department', { params });
};

export const getListPosition = (params = {}) => {
  return httpClient.get('/customer-care-type/get-position', { params });
};

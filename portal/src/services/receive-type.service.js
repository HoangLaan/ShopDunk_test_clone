import httpClient from 'utils/httpClient.js';

export const getListReceiveType = (params = {}) => {
  return httpClient.get('/receive-type', { params });
};

export const getDetailReceiveType = (id) => {
  return httpClient.get(`/receive-type/${id}`);
};
export const createReceiveType = (params) => {
  return httpClient.post(`/receive-type`, params);
};
export const updateReceiveType = (id, params) => {
  return httpClient.put(`/receive-type/${id}`, params);
};

export const deleteReceiveType = (list_id = []) => {
  return httpClient.delete(`/receive-type`, { data: { list_id } });
};

export const getReceiveTypeOptions = (params) => {
  return httpClient.get('/receive-type/get-options', { params });
};

export const getCompanyOptions = (params) => {
  return httpClient.get('/receive-type/get-company-options', { params });
};

export const getBusinessOptions = (params) => {
  return httpClient.get(`/receive-type/get-business-options`, { params });
};

// BankAccount
export const getBankAccountList = (params = {}) => {
  return httpClient.get('/receive-type/bank-account', { params });
};

export const getTreeReceiveType = (params = {}) => {
  const ROUTE_DEF = '/receive-type/tree';
  return httpClient.get(ROUTE_DEF, { params });
};


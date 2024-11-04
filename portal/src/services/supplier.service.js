import httpClient from 'utils/httpClient.js';

const path = '/supplier';

export const getOptionsSupplier = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getListSupplier = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getOptionsBusiness = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getDetailSupplier = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createSupplier = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateSupplier = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deleteSupplier = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getDetailImportSupplier = (id, params) => {
  return httpClient.get(`/stocks-in-request/supplier/${id}`, { params });
};

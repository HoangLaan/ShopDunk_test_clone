import httpClient from 'utils/httpClient.js';

const path = '/store-type';

export const getStoreTypeList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getStoreTypeDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createStoreType = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateStoreType = (params) => {
  return httpClient.put(`${path}`, params);
};

export const deleteStoreType = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getStoreTypeOptions = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

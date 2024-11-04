import httpClient from 'utils/httpClient.js';

const path = '/product-attribute';

export const getList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};
export const getOptionsProductAttribute = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
};
export const deleteProductAttribute = (id) => {
  return httpClient.delete(`${path}/${id}`);
};
export const getDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};
export const create = (params) => {
  return httpClient.post(`${path}`, params);
};
export const update = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

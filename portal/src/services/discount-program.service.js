import httpClient from 'utils/httpClient.js';

const path = '/discount-program';

export const getStatitic = (params) => {
  return httpClient.get(`${path}/statitic`, { params });
};

export const getList = (params) => {
  return httpClient.get(`${path}`, { params });
};

export const getDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};
export const createDiscountProgram = (params) => {
  return httpClient.post(`${path}`, params);
};
export const update = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deleteDiscountProgram = (list_id) => {
  return httpClient.delete(`${path}`, { data: list_id });
};

export const approveReview = (id, params) => {
  return httpClient.put(`${path}/${id}/approve`, params);
};

export const getOptions = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getDiscountProducts = (params = {}) => {
  return httpClient.get(`${path}/get-discount-products`, { params });
};
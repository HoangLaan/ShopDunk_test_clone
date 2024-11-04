import httpClient from 'utils/httpClient.js';

const route = '/output-type';

export const getList = (params) => {
  return httpClient.get(route, { params });
};

export const create = (params) => {
  return httpClient.post(route, params);
};

export const update = (id, params) => {
  return httpClient.put(route + `/${id}`, params);
};

export const read = (id, params) => {
  return httpClient.get(route + `/${id}`, params);
};

export const deleteItem = (params = {}) => {
  return httpClient.delete(route + `/delete`, { params });
};

export const getVatOpts = (params = {}) => {
  return httpClient.get(`/vat/get-options`, { params });
};

export const getOptionsPriceReview = (params = {}) => {
  return httpClient.get(`/price-review-level/get-options`, { params });
};

export const getOutputTypeOpts = (params = {}) => {
  return httpClient.get(route + `/get-options`, { params });
};

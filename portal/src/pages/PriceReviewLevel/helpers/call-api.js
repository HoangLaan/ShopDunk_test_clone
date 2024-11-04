import httpClient from 'utils/httpClient.js';

const route = '/price-review-level';

export const getList = (params) => {
  return httpClient.get(route, { params });
};

export const create = (params) => {
  return httpClient.post(route, params);
};

export const update = (params) => {
  return httpClient.post(route, params);
};

export const read = (id, params) => {
  return httpClient.get(route + `/${id}`, params);
};

export const deleteItem = (params = {}) => {
  return httpClient.delete(route + `/delete`, { params });
};

export const getRequestTypeOpts = (id, params = {}) => {
  return httpClient.get(`/request-type/get-options`, { params });
};

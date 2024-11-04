import httpClient from 'utils/httpClient.js';

const path = '/block';

export const getBlockList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getBlockDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createBlock = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateBlock = (params) => {
  return httpClient.put(`${path}`, params);
};

export const deleteBlock = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getBlockOptions = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

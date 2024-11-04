import httpClient from 'utils/httpClient.js';

const path = '/exchange-point';

export const getListExchangePoint = (params = {}) => {
  return httpClient.get(path, { params });
};

export const getDetailExchangePoint = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createExchangePoint = (params) => {
  return httpClient.post(`${path}`, params);
};

export const getStoreExchangePoint = (params) => {
  return httpClient.get(`${path}/get-store`, { params });
};

export const updateExchangePoint = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deleteExchangePoint = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

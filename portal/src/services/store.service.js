import httpClient from 'utils/httpClient.js';

export const getList = (params = {}) => {
  return httpClient.get('/store', { params });
};

export const getDetailStore = (id) => {
  return httpClient.get(`/store/${id}`);
};

export const getOptionsStore = (params) => {
  return httpClient.get('/store/get-options', { params });
};

export const deleteStore = (id) => {
  return httpClient.delete(`/store/${id}`);
};

export const create = (params) => {
  return httpClient.post(`/store`, params);
};

export const update = (id, params) => {
  return httpClient.put(`/store/${id}`, params);
};

export const deleteStoreList = (list_id = []) => {
  return httpClient.post('/store/delete', { list_id });
};

export const getDetail = (id) => {
  return httpClient.get(`/store/${id}`);
};

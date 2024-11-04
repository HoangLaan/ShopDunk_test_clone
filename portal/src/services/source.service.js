import httpClient from 'utils/httpClient.js';

export const getListSource = (params = {}) => {
  return httpClient.get('/source', { params });
};
export const getDetailSource = (id) => {
  return httpClient.get(`/source/${id}`);
};
export const createSource = (params) => {
  return httpClient.post(`/source`, params);
};
export const updateSource = (id, params) => {
  return httpClient.put(`/source/${id}`, params);
};

export const deleteSource = (list_id = []) => {
  return httpClient.delete(`/source`, { data: { list_id } });
};

export const getOptionsSource = (params) => {
  return httpClient.get('/source/get-options', { params });
};


import httpClient from 'utils/httpClient';

export const getList = (params = {}) => {
  return httpClient.get("/unit", {params});
};
export const getOptionsUnit = (params) => {
  return httpClient.get('/unit/get-options', { params });
};
export const deleteUnit = (id) => {
  return httpClient.delete(`/unit/${id}`);
};
export const getDetail = (id) => {
  return httpClient.get(`/unit/${id}`);
};
export const create = (params) => {
  return httpClient.post(`/unit`, params);
};
export const update = (id, params) => {
  return httpClient.put(`/unit/${id}`, params);
};

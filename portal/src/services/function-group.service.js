import httpClient from 'utils/httpClient.js';

export const getListFunctionGroup = (params = {}) => {
  return httpClient.get('/function-group', { params });
};
export const getDetailFunctionGroup = (id) => {
  return httpClient.get(`/function-group/${id}`);
};
export const createFunctionGroup = (params) => {
  return httpClient.post(`/function-group`, params);
};
export const updateFunctionGroup = (id, params) => {
  return httpClient.put(`/function-group/${id}`, params);
};

export const deleteFunctionGroup = (list_id = []) => {
  return httpClient.delete(`/function-group`, { data: { list_id } });
};

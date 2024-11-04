import httpClient from 'utils/httpClient.js';

export const getList = (params = {}) => {
  return httpClient.get('/function', { params });
};

export const getDetailFunction = (id) => {
  return httpClient.get(`/function/${id}`);
}

export const getOptionsFunction = (params) => {
  return httpClient.get('/function/get-options', { params });
};

export const getListFunctionGroup = (params = {}) => {
  return httpClient.get('/function-group/get-options', { is_active: 1 });
};

export const deleteFunction = (id) => {
  return httpClient.delete(`/function/${id}`);
};

export const createFunction = (params) => {
  return httpClient.post(`/function`, params);
};

export const updateFunction = (id, params) => {
  return httpClient.put(`/function/${id}`, params);
};

export const deleteFunctionList = (list_id = []) => {
  return httpClient.delete('/function', { data: { list_id } });
};
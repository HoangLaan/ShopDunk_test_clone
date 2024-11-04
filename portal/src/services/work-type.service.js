import httpClient from 'utils/httpClient.js';

export const getOptionsWorkType = (params = {}) => {
  return httpClient.get('/work-type/get-options', { params });
};

export const getListWorkType = (params = {}) => {
  return httpClient.get('/work-type', { params });
};
export const getOptionsBusiness = (params) => {
  return httpClient.get('/work-type/get-options', { params });
};

export const getDetailWorkType = (id) => {
  return httpClient.get(`/work-type/${id}`);
};
export const createWorkType = (params) => {
  return httpClient.post(`/work-type`, params);
};
export const updateWorkType = (id, params) => {
  return httpClient.put(`/work-type/${id}`, params);
};

export const deleteWorkType = (id, params) => {
  return httpClient.delete(`/work-type/${id}`, params);
};

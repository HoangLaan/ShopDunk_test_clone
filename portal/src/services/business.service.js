import httpClient from 'utils/httpClient.js';

const path = '/business';

export const getList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const deleteBusiness = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const create = (params) => {
  return httpClient.post(`${path}`, params);
};

export const update = (params) => {
  return httpClient.put(`${path}`, params);
};

export const getBusinessOptions = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getOptionsBusiness = (params) => {
  return httpClient.get('/business/get-options', { params });
};

export const getBusinessV3 = (params) => {
  return httpClient.get(path + '/option', { params });
};

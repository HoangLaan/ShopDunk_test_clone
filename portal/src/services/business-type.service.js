import httpClient from 'utils/httpClient.js';

const path = '/business-type';

export const getBusinessTypeOptions = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getList = (params = {}) => {
  return httpClient.get("/business-type", {params});
};
export const getOptionsBusinessType = (params) => {
  return httpClient.get('/business-type/get-options', { params });
};
export const deleteBusinessType = (id) => {
  return httpClient.delete(`/business-type/${id}`);
};
export const getDetail = (id) => {
  return httpClient.get(`/business-type/${id}`);
};
export const create = (params) => {
  return httpClient.post(`/business-type`, params);
};
export const update = (id, params) => {
  return httpClient.put(`/business-type/${id}`, params);
};
export const deleteListBusinessType = (list_id = []) => {
  return httpClient.delete('/business-type', { data: { list_id } });
};


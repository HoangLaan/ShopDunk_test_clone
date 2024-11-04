import httpClient from 'utils/httpClient';

export const getList = (params = {}) => {
  return httpClient.get('/short-link', { params });
};

export const getDetail = (id) => {
  return httpClient.get(`/short-link/${id}`);
};
export const create = (params) => {
  return httpClient.post(`/short-link`, params);
};
export const update = (id, params) => {
  return httpClient.put(`/short-link/${id}`, params);
};

export const handleDelete = (params) => {
  return httpClient.post(`/short-link/delete`, params);
};

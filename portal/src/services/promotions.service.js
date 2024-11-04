import httpClient from 'utils/httpClient.js';

const path = '/promotion';

export const getList = (params) => {
  return httpClient.get(`${path}`, { params });
};

export const getDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};
export const create = (params) => {
  return httpClient.post(`${path}`, params);
};
export const update = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deletePromotion = (list_id) => {
  return httpClient.delete(`${path}`, { data: list_id });
};

export const getTotalPromotion = (params) => {
  return httpClient.get(`${path}/total-option`, { params });
};

export const approveReview = (idPromotion, params) => {
  return httpClient.put(`${path}/${idPromotion}/approve`, params);
};

export const stopPromotion = (idPromotion, params) => {
  return httpClient.put(`${path}/${idPromotion}/stop`, params);
};
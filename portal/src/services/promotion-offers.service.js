import httpClient from 'utils/httpClient.js';

const path = '/promotion-offer';

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

export const deletePromotionOffer = (list_id) => {
  return httpClient.delete(`${path}`, { data: list_id });
};

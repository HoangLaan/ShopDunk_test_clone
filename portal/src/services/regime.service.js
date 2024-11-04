import httpClient from 'utils/httpClient.js';
const path='regime'

export const getListReviewRegimeType = (params) => {
  return httpClient.get(`${path}/get-list_review`, { params });
};

export const createRegisterRegime = (params) => {
  return httpClient.post(`${path}`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateRegisterRegime = (id,params) => {
  return httpClient.put(`${path}/${id}`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getListRegime = (params) => {
  return httpClient.get(`${path}`, { params });
};

export const getRegimeById = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const deleteById = (id) => {
  return httpClient.delete(`${path}/${id}`);
};




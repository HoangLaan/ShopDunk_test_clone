import httpClient from 'utils/httpClient.js';

const path = '/denomination';

export const getDenominationList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getDenominationDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createDenomination = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateDenomination = (params) => {
  return httpClient.put(`${path}`, params);
};

export const deleteDenomination = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

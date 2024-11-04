import httpClient from 'utils/httpClient.js';

const path = '/cumulate-point-type';

export const getListCumulatePointType = (params = {}) => {
  return httpClient.get(path, { params });
};

export const getDetailCumulatePointType = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createCumulatePointType = (params) => {
  return httpClient.post(`${path}`, params);
};

export const getStoreCumulatePointType = (params) => {
  return httpClient.get(`${path}/get-store`, { params });
};

export const updateCumulatePointType = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deleteCumulatePointType = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getOptionsCumlatePointType = (params = {}) => {
  return httpClient.get(path + '/get-options', { params });
};

export const calculateAccumulatedPoint = (params = {}) => {
  return httpClient.get(path + '/calculate-point', { params });
};

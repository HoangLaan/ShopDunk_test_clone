import httpClient from 'utils/httpClient.js';

const path = '/regime-type';

export const getRegimeTypeList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getDetailRegimeType = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createRegimeType = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateRegimeType = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deleteRegimeType = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getUserOptions = (params) => {
  return httpClient.get(`${path}/get-user-options`, { params });
};

export const getDepartmentOptions = (params) => {
  return httpClient.get(`${path}/get-department-options`, { params });
};

export const getReviewLevelList = (params) => {
  return httpClient.get(`${path}/review-level`, { params });
};

export const getPositionOptions = (params) => {
  return httpClient.get(`${path}/get-position-options`, { params });
};

export const createReviewLevel = (params) => {
  return httpClient.post(`${path}/review-level`, params);
};

export const deleteReviewLevel = (list_id = []) => {
  return httpClient.delete(`${path}/review-level`, { data: { list_id } });
};

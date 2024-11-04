import httpClient from 'utils/httpClient.js';

const path = '/transfer-shift';

export const getListTransferShift = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getListShift = (params = {}) => {
  return httpClient.get(`${path}/get-shift`, { params });
};

export const updateReview = (data = {}) => {
  return httpClient.post(`${path}/update-review`, data);
};

export const getDetailReview = (params = {}) => {
  return httpClient.get(`${path}/get-detail-review`, { params });
};

export const getListTransferShiftType = (params = {}) => {
  return httpClient.get(`${path}/get-transfer-shift-type`, { params });
};

export const getListReview = (params = {}) => {
  return httpClient.get(`${path}/list-review`, { params });
};

export const deleteTransferShift = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getDetailTransferShift = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createTransferShift = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateTransferShift = (id, data) => {
  return httpClient.put(`${path}/${id}`, data);
};

export const getOptionsBusiness = (params = {}) => {
  return httpClient.get(`${path}/business-options`, { params });
};

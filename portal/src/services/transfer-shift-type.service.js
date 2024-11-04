import httpClient from 'utils/httpClient.js';
const path = '/transfer-shift-type';
export const getListTransferShiftType = (params = {}) => {
  return httpClient.get(path, { params });
};
export const getDetailTransferShiftType = (id) => {
  return httpClient.get(`${path}/${id}`);
};
export const createTransferShiftType = (params) => {
  return httpClient.post(path, params);
};
export const updateTransferShiftType = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deleteTransferShiftType = (list_id = []) => {
  return httpClient.delete(path, { data: { list_id } });
};

export const getReviewLevelOptionsTransferShiftType = (params) => {
  return httpClient.get(`${path}/review-level-options`, { params });
};

export const getReviewLevelDetailTransferShiftType = (id) => {
  return httpClient.get(`${path}/review-level/${id}`);
};

// done
export const getDepartmentOptions = (params) => {
  return httpClient.get(`${path}/department-options`, { params });
};

// done
export const getCompanyOptions = (params) => {
  return httpClient.get(`${path}/company-options`, { params });
};

// done
export const getPositionOptions = (params) => {
  return httpClient.get(`${path}/position-options`, { params });
};

export const createReviewLevel = (params) => {
  return httpClient.post(`${path}/review-level`, params);
};

export const getListReviewLevel = (params = {}) => {
  return httpClient.get(`${path}/review-level`, { params });
};

export const getUserOptions = (params) => {
  return httpClient.get(`${path}/user-options`, { params });
};

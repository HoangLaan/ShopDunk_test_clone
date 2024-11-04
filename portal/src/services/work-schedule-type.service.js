import httpClient from 'utils/httpClient.js';
const path = '/work-schedule-type';

export const getListWorkScheduleType = (params = {}) => {
  return httpClient.get(path, { params });
};
export const getDetailWorkScheduleType = (id) => {
  return httpClient.get(`${path}/${id}`);
};
export const createWorkScheduleType = (params) => {
  return httpClient.post(path, params);
};

export const updateWorkScheduleType = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deleteWorkScheduleType = (list_id = []) => {
  return httpClient.delete(path, { data: { list_id } });
};

// ****************
export const getDepartmentOptions = (params) => {
  return httpClient.get(`${path}/department-options`, { params });
};

export const getCompanyOptions = (params) => {
  return httpClient.get(`${path}/company-options`, { params });
};

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

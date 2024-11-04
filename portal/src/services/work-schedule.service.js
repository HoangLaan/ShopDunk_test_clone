import httpClient from 'utils/httpClient.js';
const path = 'work-schedule';

export const getListWorkScheduleType = (params) => {
  return httpClient.get(`${path}/get-list_review`, { params });
};

export const createWorkSchedule = (params) => {
  return httpClient.post(`${path}`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateWorkSchedule = (id, params) => {
  return httpClient.put(`${path}/${id}`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getListWorkSchedule = (params) => {
  return httpClient.get(`${path}`, { params });
};

export const getWorkScheduleById = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const deleteById = (id) => {
  return httpClient.delete(`${path}/${id}`);
};

export const updateReviewLevel = (params = {}) => {
  return httpClient.put(`${path}/review-level`, params);
};

export const getOrderApply = (params) => {
  return httpClient.get(`${path}/order-apply`, { params });
};

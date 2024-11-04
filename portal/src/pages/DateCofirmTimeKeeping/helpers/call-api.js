import api from 'utils/httpClient';

export const getListTimeKeepingDateConfirm = (params) => {
  return api.get('/date-confirm-time-keeping', { params });
};

export const createTimeKeepingDateConfirm = (params = {}) => {
  return api.post('/date-confirm-time-keeping', params);
};

export const updateTimeKeepingDateConfirm = (id, params) => {
  return api.put(`/date-confirm-time-keeping/${id}`, params);
};

export const getTimeKeepingDateConfirmyById = (id) => {
  return api.get(`/date-confirm-time-keeping/${id}`);
};

export const deleteTimeKeepingDateConfirm = (list_id) => {
  return api.delete(`/date-confirm-time-keeping`, { data: list_id });
};

export const CheckTimeKeepingDateConfirm = () => {
  return api.get(`/date-confirm-time-keeping/check-date-confirm`);
};

export const getListMonth = () => {
  return api.get(`/date-confirm-time-keeping/get-month-option`);
};

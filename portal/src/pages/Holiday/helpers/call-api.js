import httpClient from 'utils/httpClient';

export const getListHoliday = (params) => {
  return httpClient.get('/holiday', { params });
};

export const createHoliday = (params = {}) => {
  return httpClient.post('/holiday', params);
};

export const updateHoliday = (holiday_id, params) => {
  return httpClient.put(`/holiday/${holiday_id}`, params);
};

export const getHolidayById = (holiday_id) => {
  return httpClient.get(`/holiday/${holiday_id}`);
};

export const deleteHoliday = (list_id) => {
  return httpClient.delete(`/holiday`, { data: list_id });
};

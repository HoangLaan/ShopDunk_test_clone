import httpClient from 'utils/httpClient';

const path = '/user_schedule';

export const getCurrentShift = (params = {}) => {
  return httpClient.get(path + '/current-schedule', { params });
};

export const getUserShifts = (params = {}) => {
  return httpClient.get(path + '/shifts-today', { params });
};

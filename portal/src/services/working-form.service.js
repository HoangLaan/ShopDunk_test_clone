import httpClient from 'utils/httpClient.js';

const path = '/working-form';

export const getWorkingFormOptions = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

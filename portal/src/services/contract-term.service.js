import httpClient from 'utils/httpClient.js';

const path = '/contract-term';

export const getContractTermOptions = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

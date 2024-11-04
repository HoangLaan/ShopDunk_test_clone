import httpClient from 'utils/httpClient.js';

const path = '/contract-type';

export const getContractTypeDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const getContractTypeOptions = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

import httpClient from 'utils/httpClient.js';

export const getCountry = (params) => {
  return httpClient.get('/country/get-options', { params });
};

export const getProvince = (params) => {
  return httpClient.get('/province/get-options', { params });
};

export const getDistrict = (params) => {
  return httpClient.get('/district/get-options', { params });
};

export const getWard = (params) => {
  return httpClient.get('/ward/get-options', { params });
};

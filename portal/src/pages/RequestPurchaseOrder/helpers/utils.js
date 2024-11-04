import httpClient from 'utils/httpClient';

export const getOptions = (path, params) => {
  return httpClient.get(`/${path}/get-options`, { params });
};

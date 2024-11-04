import httpClient from 'utils/httpClient.js';

export const getRequestTypeOpts = () => {
  return httpClient.get(`/request-type/get-options`);
};

import httpClient from 'utils/httpClient';

export const getOptionsEducationLevel = (params) => {
  return httpClient.get('/education-level/get-options', { params });
};

import httpClient from 'utils/httpClient';

const path = '/accounting';

export const getList = (params = {}) => {
  return httpClient.get(path, { params });
};

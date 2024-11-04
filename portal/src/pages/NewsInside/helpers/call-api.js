import httpClient from 'utils/httpClient';

const route = '/news';

export const getListNewInside = (params) => {
  return httpClient.get(route + '/inside', { params });
};

export const read = (id) => {
  return httpClient.get(route + `/inside/${id}`);
};

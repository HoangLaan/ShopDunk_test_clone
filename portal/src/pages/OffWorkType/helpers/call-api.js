import httpClient from 'utils/httpClient';

const route = '/off-work-type';

export const getList = (params) => {
  return httpClient.get(route, { params });
};

export const create = (params) => {
  return httpClient.post(route, params);
};

export const update = (id, params) => {
  return httpClient.put(route + `/${id}`, params);
};

export const read = (id, params) => {
  return httpClient.get(route + `/${id}`, params);
};

export const deleteItem = (params) => {
  return httpClient.delete(route, { params: { list_id: params } });
};

export const getOffworkRLOptions = (params) => {
  return httpClient.get(`/off-work-reviewlevel/get-options`, { params });
};

export const getUserReview = (id, params) => {
  return httpClient.get(`off-work-reviewlevel/${id}/users`, { params });
};

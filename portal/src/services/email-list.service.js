import httpClient from 'utils/httpClient';

const path = '/email-list';

export const getList = (params = {}) => {
  return httpClient.get(path, { params });
};

export const getById = (id) => {
  return httpClient.get(`${path}/${id}`);
};
export const create = (params) => {
  return httpClient.post(path, params);
};

export const update = (params) => {
  return httpClient.put(path, params);
};

export const deleteList = (list_id) => {
  return httpClient.delete(path, { data: { list_id } });
};

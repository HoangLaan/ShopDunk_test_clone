import api from 'utils/httpClient';

const route = '/shift';

export const gencode = (params) => {
  return api.get(route + '/shift-code', { params });
};

export const getList = (params) => {
  return api.get(route, { params });
};

export const create = (params) => {
  return api.post(route, params);
};

export const update = (id, params) => {
  return api.put(route + `/${id}`, params);
};

export const read = (id, params) => {
  return api.get(route + `/${id}`, params);
};

export const deleteItem = (id, params) => {
  return api.put(route + `/${id}/delete`, params);
};

export const getListStore = (params = {}) => {
  return api.get(route + `/store`, { params });
};

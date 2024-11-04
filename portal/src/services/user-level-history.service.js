import httpClient from 'utils/httpClient';

export const getList = (params) => {
  return httpClient.get('/user-level-history', { params });
};

export const deleteULHistory = (ids) => {
  return httpClient.delete(`/user-level-history/delete`, { data: { ids: ids } });
};

export const getDetail = (id) => {
  return httpClient.get(`/user-level-history/${id}`);
};

export const create = (params) => {
  return httpClient.post(`/user-level-history`, { ...params, username: params.username.value });
};

export const update = (id, params) => {
  return httpClient.put(`/user-level-history/${id}`, { ...params, username: params.username.value });
};

export const getUserOptions = (search = '', user_status = 1) => {
  return httpClient.get('/user-level-history/users/get-options', { params: { search, user_status } });
};

export const getUser = (username = '') => {
  return httpClient.get('/user-level-history/users/' + username);
};

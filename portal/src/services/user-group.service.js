import httpClient from 'utils/httpClient';

export const getList = (params) => {
  return httpClient.get('/usergroup', { params });
};

export const deleteUserGroup = (params) => {
  const ids = (params || []).map((x) => x.user_group_id);
  return httpClient.post(`/usergroup/delete`, { ids });
};

export const getDetail = (id) => {
  return httpClient.get(`/usergroup/${id}`);
};

export const create = (params) => {
  return httpClient.post(`/usergroup`, params);
};

export const update = (id, params) => {
  return httpClient.put(`/usergroup/${id}`, params);
};

export const getOptionsUserGroup = (params = {}) => {
  return httpClient.get('/usergroup/get-options', { params });
};

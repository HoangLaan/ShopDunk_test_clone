import httpClient from 'utils/httpClient';

export const getOptionsSkill = (params = {}) => {
  return httpClient.get('/skill/get-options', { params });
};

export const getListSkill = (params = {}) => {
  return httpClient.get('/skill', { params });
};
export const getOptionsBusiness = (params) => {
  return httpClient.get('/skill/get-options', { params });
};

export const getDetailSkill = (id) => {
  return httpClient.get(`/skill/${id}`);
};
export const createSkill = (params) => {
  return httpClient.post(`/skill`, params);
};
export const updateSkill = (id, params) => {
  return httpClient.put(`/skill/${id}`, params);
};

export const deleteSkill = (id, params) => {
  return httpClient.delete(`/skill/${id}`, params);
};

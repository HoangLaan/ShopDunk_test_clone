import httpClient from 'utils/httpClient';

export const getListSkillLevel = (params) => {
  return httpClient.get('/skill-level', { params });
};

export const createSkillLevel = (params) => {
  return httpClient.post('/skill-level', params);
};

export const updateSkillLevel = (id, params) => {
  return httpClient.put(`/skill-level/${id}`, params);
};

export const getDetail = (id) => {
  return httpClient.get(`/skill-level/${id}`);
};

export const deleteSkillLevel = (params) => {
  let ids;
  if (Array.isArray(params)) {
    ids = (params || []).map((x) => x.level_id).join(',');
  } else {
    ids = `${params}`;
  }
  return httpClient.post(`/skill-level/delete`, { ids });
};

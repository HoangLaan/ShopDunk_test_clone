import httpClient from 'utils/httpClient';

export const getListSkillGroup = (params) => {
  return httpClient.get('/skill-group', { params });
};

export const createSkillGroup = (params) => {
  return httpClient.post('/skill-group', params);
};

export const updateSkillGroup = (id, params) => {
  return httpClient.put(`/skill-group/${id}`, params);
};

export const getDetail = (id) => {
  return httpClient.get(`/skill-group/${id}`);
};

export const deleteSkillGroup = (params) => {
  let ids;
  if (Array.isArray(params)) {
    ids = (params || []).map((x) => x.skillgroup_id).join(',');
  } else {
    ids = `${params}`;
  }
  return httpClient.post(`/skill-group/delete`, { ids });
};

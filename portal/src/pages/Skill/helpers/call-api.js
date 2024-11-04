import httpClient from 'utils/httpClient';

export const getListSkill = (params) => {
  return httpClient.get('/skill', { params });
};

export const getListGroupSkillOption = () => {
  return httpClient.get('/skill-group/options');
};

export const createSkill = (params) => {
  return httpClient.post('/skill', params);
};

export const updateSkill = (id, params) => {
  return httpClient.put(`/skill/${id}`, params);
};

export const getDetail = (id) => {
  return httpClient.get(`/skill/${id}`);
};

export const deleteSkill = (params) => {
  let ids;
  if (Array.isArray(params)) {
    ids = (params || []).map((x) => x.skill_id).join(',');
  } else {
    ids = `${params}`;
  }
  return httpClient.post(`/skill/delete`, { ids });
};

export const getListSkillLevelOption = () => {
  return httpClient.get('/skill-level/options');
};

import httpClient from 'utils/httpClient';

export const getListDegree = (params) => {
  return httpClient.get('/degree', { params });
};

export const createDegree = (params) => {
  return httpClient.post('/degree', params);
};

export const updateDegree = (id, params) => {
  return httpClient.put(`/degree/${id}`, params);
};

export const getDetail = (id) => {
  return httpClient.get(`/degree/${id}`);
};

export const deleteDegree = (params) => {
  let ids;
  if (Array.isArray(params)) {
    ids = (params || []).map((x) => x.degree_id).join(',');
  } else {
    ids = `${params}`;
  }
  return httpClient.post(`/degree/delete`, { ids });
};

// export const getListSkillLevelOption = () => {
//     return httpClient.get('/skill-level/options',);
// };

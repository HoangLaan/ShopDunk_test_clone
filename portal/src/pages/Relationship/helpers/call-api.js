import httpClient from 'utils/httpClient';

export const getListRelationship = (params) => {
  return httpClient.get('/relationship', { params });
};

export const createRelationship = (params) => {
  return httpClient.post('/relationship', params);
};

export const updateRelationship = (id, params) => {
  return httpClient.put(`/relationship/${id}`, params);
};

export const getDetail = (id) => {
  return httpClient.get(`/relationship/${id}`);
};

export const deleteRelationship = (params) => {
  console.log(params);
  let ids;
  if (Array.isArray(params)) {
    ids = (params || []).map((x) => x.relationshipmember_id).join(',');
  } else {
    ids = `${params}`;
  }
  return httpClient.post(`/relationship/delete`, { ids });
};

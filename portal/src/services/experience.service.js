import httpClient from 'utils/httpClient.js';

const getList = (params) => {
  return httpClient.get('/experience', { params });
};
const create = (payload) => {
  return httpClient.post('/experience', payload);
};

const update = (id, payload) => {
  return httpClient.put(`/experience/${id}`, payload);
};

const getById = (id) => {
  return httpClient.get(`/experience/${id}`);
};

const deleteByID = (id) => {
  return httpClient.delete(`/experience/${id}`);
};

const RelationshipService = {
  getList,
  create,
  getById,
  update,
  deleteByID,
};

export default RelationshipService;

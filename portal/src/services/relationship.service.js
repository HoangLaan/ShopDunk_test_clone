import httpClient from 'utils/httpClient.js';

const getList = (params) => {
  return httpClient.get('/relationship', { params });
};
const create = (payload) => {
  return httpClient.post('/relationship', payload);
};

const update = (id, payload) => {
  return httpClient.put(`/relationship/${id}`, payload);
};

const getById = (id) => {
  return httpClient.get(`/relationship/${id}`);
};

const deleteByID = (id) => {
  return httpClient.delete(`/relationship/${id}`);
};

const RelationshipService = {
  getList,
  create,
  getById,
  update,
  deleteByID,
};

export default RelationshipService;

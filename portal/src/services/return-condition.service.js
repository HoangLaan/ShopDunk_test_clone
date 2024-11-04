import httpClient from 'utils/httpClient.js';

export const getList = (params) => {
  return httpClient.get('/return-condition', { params });
};
const create = (payload) => {
  return httpClient.post('/return-condition', payload);
};

const update = (id, payload) => {
  return httpClient.put(`/return-condition/${id}`, payload);
};

const getById = (id) => {
  return httpClient.get(`/return-condition/${id}`);
};

const deleteByID = (id) => {
  return httpClient.delete(`/return-condition/${id}`);
};

const deleteListExchange = (list_id = []) => {
  return httpClient.delete('/return-condition', { data: { list_id } });
};

const ReturnConditionService = {
  getList,
  create,
  getById,
  update,
  deleteByID,
  deleteListExchange,
};

export default ReturnConditionService;

import httpClient from 'utils/httpClient.js';

const detail = (id) => {
  return httpClient.get(`/customer-working/${id}`);
};

const getList = (params) => {
  return httpClient.get('/customer-working', { params });
};

const generateCode = (params = {}) => {
  return httpClient.get('/customer-working/generate-code', { params });
};

const create = (payload = {}) => {
  return httpClient.post('/customer-working', payload);
};

const update = (id, payload = {}) => {
  return httpClient.put(`/customer-working/${id}`, payload);
};

const deleteTaskWorking = (ids) => {
  return httpClient.delete('/customer-working', { data: { list_id: ids } });
};

const getStoreByUser = (params) => {
  return httpClient.get('/customer-working/get-store-user');
};

const CustomerWorkingService = {
  generateCode,
  detail,
  create,
  update,
  getList,
  deleteTaskWorking,
  getStoreByUser,
};

export default CustomerWorkingService;

import httpClient from 'utils/httpClient';

const getList = (params) => {
  return httpClient.get('/zalo-template', { params });
};

const getListHistory = (params) => {
  return httpClient.get('/zalo-template/history', { params });
};

const getById = (id) => {
  return httpClient.get(`/zalo-template/${id}`);
};

const create = (payload) => {
  return httpClient.post('/zalo-template', payload);
};

const update = (payload) => {
  return httpClient.put('/zalo-template/', payload);
};

const _delete = (list_id = []) => {
  return httpClient.delete('/zalo-template', { data: { list_id } });
};

const zaloTemplateService = {
  getList,
  getById,
  create,
  update,
  delete: _delete,
  getListHistory
};

export default zaloTemplateService;

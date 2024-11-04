import httpClient from 'utils/httpClient';

const getList = (params) => {
  return httpClient.get('/interest-content', { params });
};

const getById = (id) => {
  return httpClient.get(`/interest-content/${id}`);
};

const create = (payload) => {
  return httpClient.post('/interest-content', payload);
};

const update = (payload) => {
  return httpClient.put('/interest-content/', payload);
};

const _delete = (list_id = []) => {
  return httpClient.delete('/interest-content', { data: { list_id } });
};

const interestContentService = {
  getList,
  getById,
  create,
  update,
  delete: _delete,
};

export default interestContentService;

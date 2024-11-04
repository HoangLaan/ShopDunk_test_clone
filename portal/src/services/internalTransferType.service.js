import httpClient from 'utils/httpClient';

const getList = (params) => {
  return httpClient.get('/internal-transfer-type', { params });
};

const getById = (id) => {
  return httpClient.get(`/internal-transfer-type/${id}`);
};

const create = (payload) => {
  return httpClient.post('/internal-transfer-type', payload);
};

const update = (payload) => {
  return httpClient.put('/internal-transfer-type/', payload);
};

const _delete = (list_id = []) => {
  return httpClient.delete('/internal-transfer-type', { data: { list_id } });
};

const getDepartmentOptions = (params) => {
  return httpClient.get('/internal-transfer-type/get-department-options', { params });
};

const getReviewLevelList = (params) => {
  return httpClient.get('/internal-transfer-type/review-level', { params });
};

const getPositionOptions = (params) => {
  return httpClient.get('/internal-transfer-type/get-position-options', { params });
};

const createReviewLevel = (params) => {
  return httpClient.post('/internal-transfer-type/review-level', params);
};

const deleteReviewLevel = (list_id = []) => {
  return httpClient.delete('/internal-transfer-type/review-level', { data: { list_id } });
};

const updateReview = (payload) => {
  return httpClient.post('/internal-transfer-type/review', payload);
};

const getUserOptions = (params) => {
  return httpClient.get('/internal-transfer-type/get-user-options', { params });
};

const internalTransferTypeService = {
  getList,
  getById,
  create,
  update,
  delete: _delete,
  getDepartmentOptions,
  getReviewLevelList,
  getPositionOptions,
  createReviewLevel,
  deleteReviewLevel,
  getUserOptions,
  updateReview,
};

export default internalTransferTypeService;

import httpClient from 'utils/httpClient.js';

const getList = (params) => {
  return httpClient.get('/bank-user', { params });
};

const getById = (id) => {
  return httpClient.get(`/bank-user/${id}`);
};

const create = (payload) => {
  return httpClient.post('/bank-user', payload);
};

const update = (id, payload) => {
  return httpClient.put(`/bank-user/${id}`, payload);
};

const _delete = (list_id = []) => {
  return httpClient.delete('/bank-user', { data: { list_id } });
};

const exportExcel = (payload) => {
  return httpClient.post('/bank-user/export-excel', payload, { responseType: 'blob' });
};

const getTemplateImport = () => {
  return httpClient.post('/bank-user/template-import', {}, { responseType: 'blob' });
};

const importExcel = (file) => {
  const formData = new FormData();
  formData.append('bank_user_import', file);

  return httpClient.post('/bank-user/import-excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const BankUserService = {
  getList,
  getById,
  create,
  update,
  delete: _delete,
  exportExcel,
  getTemplateImport,
  importExcel,
};

export default BankUserService;

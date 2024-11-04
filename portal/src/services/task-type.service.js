import httpClient from 'utils/httpClient.js';

const getList = (params) => {
  return httpClient.get('/task-type', { params });
};

const getTaskWorkFlow = (params) => {
  return httpClient.get('/task-type/get-task-workflow', { params });
};

const getById = (id) => {
  return httpClient.get(`/task-type/${id}`);
};

const create = (payload) => {
  return httpClient.post('/task-type', payload);
};

const update = (id, payload) => {
  return httpClient.put(`/task-type/${id}`, payload);
};

const _delete = (list_id = []) => {
  return httpClient.delete('/task-type', { data: { list_id } });
};

const exportExcel = (payload) => {
  return httpClient.post('/task-type/export-excel', payload, { responseType: 'blob' });
};

const getTemplateImport = () => {
  return httpClient.post('/task-type/template-import', {}, { responseType: 'blob' });
};

const importExcel = (file) => {
  const formData = new FormData();
  formData.append('task_type_import', file);

  return httpClient.post('/task-type/import-excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const getListUser = (params = {}) => {
  return httpClient.get('/task-type/get-user', { params });
};

const createCondition = (payload) => {
  return httpClient.post('/task-type/condition', payload);
};

const getListCondition = (params) => {
  return httpClient.get('/task-type/condition', { params });
};

const TaskTypeService = {
  getList,
  getTaskWorkFlow,
  getById,
  create,
  update,
  delete: _delete,
  getTemplateImport,
  importExcel,
  exportExcel,
  getListUser,
  createCondition,
  getListCondition,
};

export default TaskTypeService;

import httpClient from 'utils/httpClient.js';

const detail = (id) => {
  return httpClient.get(`/customer-lead/${id}`);
};

const getList = (params) => {
  return httpClient.get('/customer-lead', { params });
};

const generateCode = (params = {}) => {
  return httpClient.get('/customer-lead/generate-code', { params });
};

const create = (payload = {}) => {
  return httpClient.post('/customer-lead', payload);
};

const update = (id, payload = {}) => {
  return httpClient.put(`/customer-lead/${id}`, payload);
};

const updateFullName = (id, payload = {}) => {
  return httpClient.put(`/customer-lead/${id}/change-name`, payload);
};

const _delete = (ids) => {
  return httpClient.post('/customer-lead/delete', { ids });
};

const createCustomer = (payload) => {
  return httpClient.post('/customer-lead/customer', payload);
};

const createCustomerCompany = (payload) => {
  return httpClient.post('/customer-lead/customer-company', payload);
};

const changePassword = (id, params) => {
  return httpClient.put(`/customer-lead/${id}/change-password`, params);
};

const getListCustomerCompany = (params = {}) => {
  return httpClient.get('/customer-lead/customer-company', { params });
};

// Get options
const getOptionsSource = (params = {}) => {
  return httpClient.get('/customer-lead/source/get-options', { params });
};

const getOptionsCustomerType = (params = {}) => {
  return httpClient.get('/customer-lead/customer-type/get-options', { params });
};

const getOptionsPresenter = (params = {}) => {
  return httpClient.get('/customer-lead/presenter/get-options', { params });
};

const getOptions = (params = {}) => {
  return httpClient.get('/customer-lead/get-options', { params });
};

const exportExcel = (payload) => {
  return httpClient.post('/customer-lead/export-excel', payload, { responseType: 'blob' });
};

const getTemplateImport = (payload) => {
  return httpClient.post('/customer-lead/template-import', payload, { responseType: 'blob' });
};

const importExcel = (file) => {
  const formData = new FormData();
  formData.append('customer_lead_import', file);

  return httpClient.post('/customer-lead/import-excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const CustomerLeadService = {
  getOptionsSource,
  getOptionsCustomerType,
  getOptionsPresenter,
  generateCode,
  detail,
  create,
  update,
  getList,
  delete: _delete,
  getOptions,
  createCustomer,
  createCustomerCompany,
  getListCustomerCompany,
  changePassword,
  exportExcel,
  getTemplateImport,
  importExcel,
  updateFullName
};

export default CustomerLeadService;

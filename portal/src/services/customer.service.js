import httpClient from 'utils/httpClient.js';

export const getListCustomerType = (params) => {
  return httpClient.get('/customer-type', { params });
};

export const getListSource = () => {
  return httpClient.get('/account/list-source');
};

export const getListProcessStep = () => {
  return httpClient.get('/account/list-process-step');
};

export const getListUserRepair = () => {
  return httpClient.get('/account/list_user_repair');
};

export const getListCustomer = (params) => {
  return httpClient.get('/account', { params });
};

export const getListCustomerOptimal = (params) => {
  return httpClient.get('/account/list_customer', { params });
};

export const deleteCustomer = (id) => {
  return httpClient.delete(`/account/${id}`);
};

export const exportExcelCustomer = (params) => {
  const header = { responseType: 'blob' };
  return httpClient.post('/account/export-excel', params, header);
};

export const getDetailCustomer = (id) => {
  return httpClient.get(`/account/${id}`);
};

export const changePassCRMAccount = (id, params) => {
  return httpClient.put(`/account/${id}/change-password`, params);
};

export const generateCustomerCode = () => {
  return httpClient.get(`/account/gen-customer-code`);
};

export const getListCarrer = () => {
  return httpClient.get(`/account/list-career`);
};

export const getListHistoryCustomerType = (customer_id) => {
  return httpClient.get(`/account/list-customertype-history-list/${customer_id}`);
};

export const getListHistoryCustomerRepair = (customer_id, params) => {
  return httpClient.get(`/account/list-warranty-repair-history/${customer_id}`, { params });
};

export const getListHistoryPurchase = (params) => {
  return httpClient.get(`/account/list-purchase-history`, { params });
};

export const createCustomer = (params) => {
  return httpClient.post(`/account`, params);
};

export const updateCustomer = (id, params) => {
  return httpClient.put(`/account/${id}`, params);
};

export const updateFullName = (id, params) => {
  return httpClient.put(`/account/${id}/change-name`, params);
};

export const deleteListCustomer = (list_id = []) => {
  return httpClient.delete('/account', { data: { list_id } });
};

export const getListAddressBook = (member_id) => {
  return httpClient.get(`/account/address-book/${member_id}`);
};

export const createAddressBook = (payload) => {
  return httpClient.post('/account/address-book', payload);
};

export const getOptionsProductAttribute = (params) => {
  return httpClient.get('/account/get-options-product-attribute', { params });
};

export const createHobbies = (payload) => {
  return httpClient.post(`/account/hobbies`, payload);
};

export const getOptionsRelationship = (params) => {
  return httpClient.get('/account/get-options-relationship', { params });
};

export const updateCustomerHobbiesRelatives = (customer_id, payload) => {
  return httpClient.put(`/account/${customer_id}/hobbies-relatives`, payload);
};

export const getDetailHobbiesRelatives = (customer_id) => {
  return httpClient.get(`/account/${customer_id}/hobbies-relatives`);
};

export const deleteHobbiesRelatives = (account_hobbies_id) => {
  return httpClient.delete(`/account/${account_hobbies_id}/hobbies-relatives`);
};

export const updateCustomerAddressBookList = (customer_id, payload) => {
  return httpClient.put(`/account/v2/address-book/${customer_id}`, payload);
};

export const getTemplateImport = (payload) => {
  return httpClient.post('/account/template-import', payload, { responseType: 'blob' });
};

export const importExcel = (file) => {
  const formData = new FormData();
  formData.append('customer_import', file);

  return httpClient.post('/account/import-excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getListCustomerCompany = (params = {}) => {
  return httpClient.get('/customer-lead/customer-company', { params });
};

export const createCustomerCompany = (payload) => {
  return httpClient.post('/customer-lead/customer-company', payload);
};

export const getOptionsSource = (params = {}) => {
  return httpClient.get('/customer-lead/source/get-options', { params });
};

export const getOptionsCustomerType = (params = {}) => {
  return httpClient.get('/customer-lead/customer-type/get-options', { params });
};

export const getListHistoryTask = (params) => {
  return httpClient.get('/account/task-history', { params });
};

export const createCustomerLead = (params = {}) => {
  return httpClient.post('/customer-lead', params);
};

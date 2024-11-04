import httpClient from 'utils/httpClient.js';

export const getListPartner = (params = {}) => {
  return httpClient.get('/partner', { params });
};

export const getDetailPartner = (id) => {
  return httpClient.get(`/partner/${id}`);
};

export const createPartner = (params) => {
  return httpClient.post(`/partner`, params);
};

export const updatePartner = (id, params) => {
  return httpClient.put(`/partner/${id}`, params);
};

export const deletePartner = (list_id = []) => {
  return httpClient.delete(`/partner`, { data: { list_id } });
};

export const getOptionsPartner = (params) => {
  return httpClient.get('/partner/get-options', { params });
};

export const getOptionUser = (params) => {
  return httpClient.get('/partner/get-option-user', { params });
};

export const getOptionAccount = (params) => {
  return httpClient.get('/partner/get-option-account', { params });
};

export const getOptionSource = (params) => {
  return httpClient.get('/partner/get-option-source', { params });
};

export const getOptionCustomerType = (params) => {
  return httpClient.get('/partner/get-option-customer-type', { params });
};

export const getCustomerTypeInfo = (id) => {
  return httpClient.get(`/partner/get-customer-type/${id}`);
};

export const getListCustomerAccount = (params) => {
  return httpClient.get('/partner/get-customer-contact', { params });
};

export const downloadAttachment = (id) => {
  const header = {
    responseType: 'blob',
  };
  return httpClient.get(`/partner/download-attachment/${id}`, header);
};

export const exportExcel = (params) => {
  return httpClient.post(`/partner/export-excel`, params, {responseType: `blob`});
};

export const getListAccount = (params) => {
  return httpClient.get(`/partner/get-options-list-account`, {params});
};

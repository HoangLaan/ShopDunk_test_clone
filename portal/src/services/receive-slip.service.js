import httpClient from 'utils/httpClient';

const route = '/receive-payment-slip';

export const getList = (params = {}, payment_type = 1) => {
  return httpClient.get(route, { params: { ...params, payment_type } });
};
export const getStatistics = (params = {}) => {
  return httpClient.get(route + '/statistics', { params });
};
export const deleteReceivePaymentSlip = (list_id) => {
  return httpClient.delete(route, { data: { list_id } });
};
export const bookkeeping = (list_id) => {
  return httpClient.put(route + '/bookkeeping', { list_id });
};
export const unBookkeeping = (list_id) => {
  return httpClient.put(route + '/un-bookkeeping', { list_id });
};
export const getDeptAccountOpts = () => {
  return httpClient.get(route + '/dept-account-opts');
};
export const getCreditAccountOpts = () => {
  return httpClient.get(route + '/credit-account-opts');
};
export const getReceiveTypeOpts = (params) => {
  return httpClient.get(route + '/receive-slip-type-opts', { params });
};
export const getPaymentTypeOpts = (params) => {
  return httpClient.get(route + '/payment-slip-type-opts', { params });
};
export const getBusinessOpts = (params) => {
  return httpClient.get(route + '/business-by-user-opts', { params });
};
export const getStoreOpts = (params) => {
  return httpClient.get(route + '/store-by-user-opts', { params });
};

export const getDetailReceiveSlip = (id) => {
  return httpClient.get(`/receive-slip/${id}`);
};

export const getListReceiveSlip = (params = {}) => {
  return httpClient.get('/receive-slip', { params });
};
export const getOptionsReceiveSlip = (params) => {
  return httpClient.get('/receive-slip/get-options', { params });
};
export const genReceiveSlipCode = (params = {}) => {
  return httpClient.get('/receive-slip/gen-code', { params });
};

export const createReceiveSlip = (params) => {
  return httpClient.post(`/receive-slip`, params);
};

export const createListReceiveSlip = (params) => {
  return httpClient.post(`/receive-slip/create-list`, params);
};

export const updateReceiveSlip = (params) => {
  return httpClient.put(`/receive-slip`, params);
};

export const getOptionsReceiveType = (params) => {
  return httpClient.get('/receive-slip/get-receive-type', { params });
};
export const getCashierByCompanyId = (params) => {
  return httpClient.get('/receive-slip/get-cashier', { params });
};

export const uploadReceiveSlipFile = (file, onUploadProgress) => {
  let formData = new FormData();
  formData.append('files', file);
  return httpClient.post('/receive-slip/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};
export const exportPDF = (params) => {
  return httpClient.get('/receive-payment-slip/export-pdf', { params });
};

export const deleteFile = (data) => {
  return httpClient.delete(`/receive-slip/file/${data.file_id}/module/${data.file_module_id}`, data);
};

export const exportExcel = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(route + '/export-excel', { params, ...header });
};

export const importExcel = (file, payment_type = 1) => {
  let formData = new FormData();
  formData.append(`itemimport`, file);
  return httpClient.post(`${route}/import-excel?payment_type=${payment_type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const downloadTemplate = (_data) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${route}/download-excel`, header);
};

export const updateReview = (params) => {
  return httpClient.put(`${route}/update-review`, params);
};

export const confirmReceiveMoney = (params = {}) => {
  return httpClient.post(`/receive-slip/confirm-receive-money`, params);
};

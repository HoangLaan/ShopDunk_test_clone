import httpClient from 'utils/httpClient.js';

const path = '/accounting-account';

export const getListAccountingAccount = (params = {}) => {
  return httpClient.get(path, { params });
};
export const getTreeAccountingAccount = (params = {}) => {
  return httpClient.get(`${path}/tree`, { params });
};
export const exportExcelAccountingAccount = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/export-excel`, { params, ...header });
};

export const getDetailAccountingAccount = (id) => {
  return httpClient.get(`${path}/${id}`);
};
export const createAccountingAccount = (params) => {
  return httpClient.post(path, params);
};
export const updateAccountingAccount = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deleteAccountingAccount = (list_id = []) => {
  return httpClient.delete(path, { data: { list_id } });
};

export const downloadTemplate = (_data) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/download-excel`, header);
};

export const importExcel = (file) => {
  let formData = new FormData();
  formData.append(`account_import`, file);
  return httpClient.post(`${path}/import-excel`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getListByUser = (id) => {
  return httpClient.get('/account/get-list-customer');
};

export const getOptions = (params = {}) => {
  return httpClient.get(path + '/options', { params });
};

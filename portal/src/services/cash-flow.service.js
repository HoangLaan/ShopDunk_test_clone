import httpClient from 'utils/httpClient.js';

const path = '/cash-flow';

export const getCashFlowList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getCashFlowDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createCashFlow = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateCashFlow = (params) => {
  return httpClient.put(`${path}`, params);
};

export const deleteCashFlow = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getCashFlowOptions = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const exportExcelCashFlow = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/export-excel`, { params, ...header });
};

export const downloadTemplateCashFlow = (_data) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/download-excel-template`, header);
};

export const importExcelCashFlow = (file) => {
  let formData = new FormData();
  formData.append(`import_file`, file);
  return httpClient.post(`${path}/import-excel`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

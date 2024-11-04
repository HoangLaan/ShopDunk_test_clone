import httpClient from 'utils/httpClient.js';

const path = '/request-using-budget';

export const getListRequestUsingBudget = (params = {}) => {
  return httpClient.get(path, { params });
};

export const getRemainingAllocationBudget = (params = {}) => {
  return httpClient.get(`${path}/remaining-allocation-budget`, { params });
};

export const exportPDFRequestUsingBudget = (data) => {
  return httpClient.get(`${path}/export-pdf/${data}`);
};

export const exportExcelRequestUsingBudget = (params) => {
  const header = { responseType: 'blob' };
  return httpClient.post(`${path}/export-excel`, params, header);
};

export const getListReview = (params = {}) => {
  return httpClient.get(`${path}/review`, { params });
};

export const getListRequestPurchase = (params = {}) => {
  return httpClient.get(`${path}/requset-purchase`, { params });
};

export const getCodeRequestUsingBudget = (params = {}) => {
  return httpClient.get(`${path}/create-code`);
};

export const getDetailRequestUsingBudget = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createRequestUsingBudget = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateReview = (params) => {
  return httpClient.put(`${path}/update-review`, params);
};

export const updateRequestUsingBudget = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deleteRequestUsingBudget = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const downloadTemplate = (_data) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/download-excel`, header);
};

export const importExcel = (file) => {
  let formData = new FormData();
  formData.append(`requestusingbudgetimport`, file);
  return httpClient.post(`${path}/import-excel`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getTreeRequestUsingBudget = (params = {}) => {
  return httpClient.get(`${path}/tree`, { params });
};

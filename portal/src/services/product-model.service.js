import httpClient from 'utils/httpClient.js';

const path = '/product-model';

export const getList = (params) => {
  return httpClient.get(`${path}`, { params });
};
export const deleteProductModel = (params) => {
  const ids = (params || []).map((x) => x.model_id);
  return httpClient.post(`${path}/delete`, { ids });
};
export const getDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};
export const create = (params) => {
  return httpClient.post(`${path}`, params);
};
export const update = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};
export const getOptionsProductCategory = (params) => {
  return httpClient.get(`${path}/get-options-for-create`, { params });
};
export const exportExcel = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/export-excel`, { params, ...header });
};

export const getListAttributes = (params) => {
  return httpClient.get(`${path}/attributes`, { params });
};
export const createAttribute = (params) => {
  return httpClient.post(`${path}/attributes`, params);
};

export const getAttributeDetail = (id) => {
  return httpClient.get(`${path}/attributes/${id}`);
};

export const getAccountingOptions = (params) => {
  return httpClient.get(`${path}/accounting-options`, { params });
};

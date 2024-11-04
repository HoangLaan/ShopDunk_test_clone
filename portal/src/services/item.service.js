import httpClient from 'utils/httpClient.js';

const route = '/item';

export const getList = (params) => {
  return httpClient.get(route, { params });
};

export const create = (params) => {
  return httpClient.post(route, params);
};

export const update = (item_id, params) => {
  return httpClient.put(route, { ...params, item_id });
};

export const getDetail = (id, params) => {
  return httpClient.get(route + `/${id}`, params);
};

export const deleteItems = (list_id = []) => {
  return httpClient.delete(route, { data: { list_id } });
};

export const getParentOptions = (params = {}) => {
  return httpClient.get(route + '/get-options', { params });
};

export const exportExcel = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(route + '/export-excel', { params, ...header });
};

export const importExcel = (file) => {
  let formData = new FormData();
  formData.append(`itemimport`, file);
  return httpClient.post(`${route}/import-excel`, formData, {
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

import httpClient from 'utils/httpClient.js';

const path = '/material';

export const getList = (params = {}) => httpClient.get(`${path}`, { params });
export const deleteProduct = (params) => {
  const ids = (params || []).map((x) => x.material_id);
  return httpClient.delete(`${path}`, { data: { ids } });
};

export const getDetail = (id) => httpClient.get(`${path}/${id}`);
export const create = (params) => httpClient.post(`${path}`, params);
export const update = (id, params) => httpClient.put(`${path}/${id}`, params);
export const getListByProduct = (params) => httpClient.get(`${path}/get-by-product`, { params });

export const getListAttributes = (params) => httpClient.get(`${path}/attributes`, { params });
export const createAttribute = (params) => httpClient.post(`${path}/attributes`, params);

export const exportExcel = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/export-excel`, { params, ...header });
};

export const downloadTemplate = (_data) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/download-excel-template`, header);
};

export const importExcel = (file) => {
  let formData = new FormData();
  formData.append(`import_file`, file);
  return httpClient.post(`${path}/import-excel`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const genCode = (params) => httpClient.get(`${path}/gen-code`, params);

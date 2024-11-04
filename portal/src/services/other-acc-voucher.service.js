import httpClient from 'utils/httpClient';

const path = '/other-voucher';

export const getList = (params = {}) => {
  return httpClient.get(path, { params });
};

export const getById = (id) => {
  return httpClient.get(`${path}/${id}`);
};
export const create = (params) => {
  return httpClient.post(path, params);
};

export const update = (params) => {
  return httpClient.put(path, params);
};

export const deleteList = (list_id) => {
  return httpClient.delete(path, { data: { list_id } });
};

export const genCode = () => {
  return httpClient.get(path + '/gen-code');
};

export const getObjectOptions = (params = {}) => {
  return httpClient.get(path + '/object-options', { params });
};

export const getVoucherTypeOptions = (params = {}) => {
  return httpClient.get(path + '/voucher-type-options', { params });
};

export const exportPDF = (params) => {
  return httpClient.get(path + '/export-pdf', { params });
};

export const exportExcel = (body) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.post(path + '/export-excel', body, header);
};

export const getStoreOptions = (params = {}) => {
  return httpClient.get(path + '/store-option', { params });
};

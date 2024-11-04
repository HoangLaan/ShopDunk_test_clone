import httpClient from 'utils/httpClient.js';
const path = '/pay-partner';

export const getListPayPartner = (params = {}) => {
  return httpClient.get(path, { params });
};

export const getListStoreBankAccount = (params = {}) => {
  return httpClient.get(path + '/get-store-bank-account', { params });
};

export const getDetailPayPartner = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const uploadPayPartnerFile = (file, onUploadProgress) => {
  let formData = new FormData();
  formData.append('files', file);
  return httpClient.post(`${path}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const createPayPartner = (params) => {
  return httpClient.post(path, params);
};

export const updatePayPartner = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deletePayPartner = (list_id = []) => {
  return httpClient.delete(path, { data: { list_id } });
};

export const getOptions = (params = {}) => {
  return httpClient.get(path + '/options', { params });
};

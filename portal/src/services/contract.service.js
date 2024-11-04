import httpClient from 'utils/httpClient.js';

const path = '/contract';

export const getContractList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getContractDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createContract = (params) => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  return httpClient.post(`${path}`, params, { headers });
};

export const updateContract = (params) => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  return httpClient.put(`${path}`, params, { headers });
};

export const deleteContract = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getContractOptions = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const downloadAttachment = (id) => {
  const header = {
    responseType: 'blob',
  };
  return httpClient.get(`${path}/download-attachment/${id}`, header);
};

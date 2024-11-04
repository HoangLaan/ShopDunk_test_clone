import httpClient from 'utils/httpClient.js';

const path = '/proposal';

export const getListProposal = (params = {}) => {
  return httpClient.get(path, { params });
};

export const getDetailProposal = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const getListReview = (params) => {
  return httpClient.get(`${path}/get-review`, { params });
};

export const getUserInformation = (params) => {
  return httpClient.get(`${path}/get-user`, { params });
};

export const exportPDF = (params) => {
  return httpClient.get(`${path}/export-pdf`, { params });
};

export const updateReview = (params) => {
  return httpClient.put(`${path}/update-review`, params);
};

export const createProposal = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateProposal = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deleteProposal = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

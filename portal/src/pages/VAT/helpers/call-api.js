import httpClient from 'utils/httpClient';

export const getListVAT = (params) => {
  return httpClient.get('/vat', { params });
};

export const createVAT = (params) => {
  return httpClient.post('/vat', params);
};

export const updateVAT = (params) => {
  return httpClient.patch(`/vat`, params);
};

export const getDetail = (id) => {
  return httpClient.get(`/vat/${id}`);
};

export const deleteVAT = (vat_id) => {
  return httpClient.delete(`/vat/${vat_id}`);
};

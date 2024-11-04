import httpClient from 'utils/httpClient.js';

const path = '/payment-form';

export const getListPaymentForm = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const deletePaymentForm = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getDetailPaymentForm = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createPaymentForm = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updatePaymentForm = (params) => {
  return httpClient.put(`${path}`, params);
};

export const getListByStore = (store_id) => {
  return httpClient.get(`${path}/get-by-store/${store_id}`);
};

export const getPaymentFormOptions = (params) => {
  return httpClient.get(path + '/options', { params });
};

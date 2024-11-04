import httpClient from 'utils/httpClient.js';

export const getListCustomerContact = (params = {}) => {
  return httpClient.get('/customer-contact', { params });
};

export const createCustomerContact = (params) => {
  return httpClient.post(`/customer-contact`, params);
};

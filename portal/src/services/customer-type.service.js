import httpClient from 'utils/httpClient';

export const getList = (params) => {
  return httpClient.get('/customer-type', { params });
};

export const deleteCustomer = (list_id = []) => {
  return httpClient.delete(`/customer-type/`, { data: { list_id } });
};

export const getDetail = (id) => {
  return httpClient.get(`/customer-type/${id}`);
};

export const create = (params) => {
  return httpClient.post(`/customer-type`, params);
};

export const update = (id, params) => {
  return httpClient.put(`/customer-type/${id}`, params);
};

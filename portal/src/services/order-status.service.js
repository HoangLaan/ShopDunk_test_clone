import httpClient from 'utils/httpClient.js';

const path = '/order-status';

export const getListOrderStatus = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const delOrderStatus = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const createOrderStatus = (values) => {
  return httpClient.post(`${path}`, values);
};

export const updateOrderStatus = (values) => {
  return httpClient.put(`${path}`, values);
};

export const getDetaiOrderStatus = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const getOrderStatusOptions = (params) => {
  return httpClient.get(`${path}/get-options`);
}

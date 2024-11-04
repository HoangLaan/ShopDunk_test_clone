import httpClient from 'utils/httpClient';

export const getListOrderType = (params) => {
  return httpClient.get('/order-type', { params });
};

export const createOrderType = (params) => {
  return httpClient.post('/order-type', params);
};

export const updateOrderType = (id, params) => {
  return httpClient.put(`/order-type/${id}`, params);
};

export const getDetail = (id) => {
  return httpClient.get(`/order-type/${id}`);
};

export const deleteOrderType = (params) => {
  let ids;
  if (Array.isArray(params)) {
    ids = (params || []).map((x) => x.order_type_id).join(',');
  } else {
    ids = `${params}`;
  }
  return httpClient.post(`/order-type/delete`, { ids });
};

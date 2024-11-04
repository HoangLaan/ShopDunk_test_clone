import httpClient from 'utils/httpClient.js';

const route = '/lockshift-close';

export const getList = (params) => {
  return httpClient.get(route, { params });
};

export const create = (params) => {
  return httpClient.post(route, params);
};

export const update = (lockshift_id, params) => {
  return httpClient.put(route, { ...params, lockshift_id });
};

export const getDetail = (id, params) => {
  return httpClient.get(route + `/${id}`, params);
};

export const getStatistics = (lockshift_id) => {
  return httpClient.get(route + `/statistics/${lockshift_id}`);
};

export const getListProduct = (params) => {
  return httpClient.get(route + '/products', { params });
};

export const getListEquipment = (params) => {
  return httpClient.get(route + '/equipments', { params });
};

export const getListLockshiftCustomers = (id, params) => {
  return httpClient.get(route + `/customer/${id}`, { params });
};

export const getListLockshiftProducts = (id, params) => {
  return httpClient.get(route + `/product/${id}`, { params });
};

export const getListLockShiftEquipments = (id, params) => {
  return httpClient.get(route + `/equipment/${id}`, { params });
};

export const checkUserHaveShift = () => {
  return httpClient.get(route + '/check-have-shift');
};

export const checkProductInventory = (params) => {
  return httpClient.put(route + '/products-inventory', { products: params });
};

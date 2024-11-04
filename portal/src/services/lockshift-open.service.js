import httpClient from 'utils/httpClient.js';

const route = '/lock-shift-open';

export const getList = (params) => {
  return httpClient.get(route, {params});
};

export const getStatistics = (params) => {
  return httpClient.get(route + `/statistics`,params?{params}:null);
};

export const createOrUpdateLockShift = (params) => {
  return httpClient.post(route, params);
};

export const getDetail = (params) => {
  return httpClient.get(route + `/info`, params?{params}:null);
};

export const getListCash = (params) => {
  return httpClient.get(route + `/cash`,params?{params}:null);
};

export const getListProduct = (params) => {
  return httpClient.get(route + `/product`,params?{params}:null);
};

export const getListEquipment = (params) => {
  return httpClient.get(route + `/equipment`,params?{params}:null);
};

export const getListCustomer = (params) => {
  return httpClient.get(route + `/customer`,params?{params}:null);
};

export const getIsAllowOpenShift = () => {
  return httpClient.get(route + `/check`);
};

export const getHasPermission = () => {
  return httpClient.get(route + `/check-permission`);
};

export const deleteProductInShift = (params) => {
   return httpClient.delete(route + `/delete-product/${params}`);
};



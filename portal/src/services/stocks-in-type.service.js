import httpClient from 'utils/httpClient.js';

export const getList = (params = {}) => {
  return httpClient.get("/stocks-in-type", {params});
};
export const getOptionsStocksInType = (params) => {
  return httpClient.get('/stocks-in-type/get-options', { params });
};
export const deleteStocksInType = (id) => {
  return httpClient.delete(`/stocks-in-type/${id}`);
};
export const getDetail = (id) => {
  return httpClient.get(`/stocks-in-type/${id}`);
};
export const create = (params) => {
  return httpClient.post(`/stocks-in-type`, params);
};
export const update = (id, params) => {
  return httpClient.put(`/stocks-in-type/${id}`, params);
};
export const getListStockInType = (params = {}) => {
  return httpClient.get("/stocks-in-type", {params});
};

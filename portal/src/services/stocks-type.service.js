import httpClient from 'utils/httpClient.js';

export const getList = (params) => {
  return httpClient.get("/stocks-type", {params});
};
export const deleteStocksType = (id) => {
  return httpClient.delete(`/stocks-type/${id}`);
};
export const deleteListStocksType = (list_id = []) => {
  return httpClient.delete('/stocks-type', { data: { list_id } });
};
export const getDetail = (id) => {
  return httpClient.get(`/stocks-type/${id}`);
};
export const create = (params) => {
  return httpClient.post(`/stocks-type`, params);
};
export const update = (id, params) => {
  return httpClient.put(`/stocks-type/${id}`, params);
};
export const getOptionsStocksType = (params) => {
  return httpClient.get('/stocks-type/get-options', { params });
};

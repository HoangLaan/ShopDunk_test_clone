import httpClient from 'utils/httpClient.js';

export const getList = (params) => {
  return httpClient.get('/stocks', { params });
};
export const deleteStocks = (id) => {
  return httpClient.delete(`/stocks/${id}`);
};
export const getDetail = (id) => {
  return httpClient.get(`/stocks/${id}`);
};
export const create = (params) => {
  return httpClient.post(`/stocks`, params);
};
export const update = (id, params) => {
  return httpClient.put(`/stocks/${id}`, params);
};
export const getOptionsStocks = (params) => {
  return httpClient.get('/stocks/get-options', { params });
};

export const getOptionsStocksByStore = (params) => {
  return httpClient.get('/stocks/get-options-by-store', { params });
};

export const getOptionsStocksByStoreBusiness = (params) => {
  return httpClient.get('/stocks/get-options-by-store-business', { params });
};

export const checkBusinessBelongsToStocks = (params) => {
  return httpClient.get('/stocks/check-belongs-to-business', { params });
};

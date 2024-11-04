import httpClient from 'utils/httpClient.js';

export const getListStocks = (params) => {
  return httpClient.get('/stocks', { params });
};

export const createStocks = (params) => {
  return httpClient.post('/stocks', params);
};

export const updateStocks = (id, params) => {
  return httpClient.put(`/stocks/${id}`, params);
};

export const getDetail = (id) => {
  return httpClient.get(`/stocks/${id}`);
};

export const deleteStocks = (params) => {
  let ids;
  if (Array.isArray(params)) {
    ids = (params || []).map((x) => x.stocks_id).join(',');
  } else {
    ids = `${params}`;
  }
  return httpClient.delete(`/stocks/delete`, { data: { ids } });
};

export const getListStocksTypeOptions = (params) => {
  return httpClient.get('/stocks/stocks-type/get-options', { params });
};

export const getListStoreOptions = (params) => {
  return httpClient.get('/stocks/store/get-options', { params });
};

export const getListUserByStoreIdOptions = (params) => {
  return httpClient.get('/stocks/list-user/get-options', { params });
};

export const getListStoreOptionsByParam = (params) => {
  return httpClient.get('/stocks/store/get-options-by-param', { params });
};

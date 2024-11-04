import httpClient from 'utils/httpClient';

export const getListStocksTransferType = (params = {}) => {
  return httpClient.get('/stocks-transfer-type', { params });
};

export const delStocksTransferType = (ids = []) => {
  return httpClient.delete('/stocks-transfer-type', { data: { ids } });
};

export const createOrUpdateStocksTransferType = (values) => {
  return httpClient.post(`/stocks-transfer-type`, values);
};

export const getDetaiStocksTransferType = (id) => {
  return httpClient.get(`/stocks-transfer-type/${id}/detail`);
};

export const getOptionsStocksReviewTransfer = (type) => {
  return httpClient.get(`/stocks-review-level/get-options/${type}`);
};

export const getListUserReviewById = (params) => {
  return httpClient.get(`/stocks-in-type/get-user`, { params });
};
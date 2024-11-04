import httpClient from 'utils/httpClient';

export const getListStocksWithStore = (store_id) => {
  return httpClient.get(`/stocks-take-request/stocks-list/store/${store_id}`);
};

export const getListStocksTakeRequest = (params = {}) => {
  return httpClient.get('/stocks-take-request', { params });
};

export const getStocksTakeRequestDetail = (id) => {
  return httpClient.get(`/stocks-take-request/${id}`);
};

export const getListStocksTake = () => {
  return httpClient.get('/stocks-take-type/get-options');
};

export const createStocksTake = (params) => {
  return httpClient.post(`/stocks-take-request/`, params);
};

export const updateStocksTake = (id, params) => {
  return httpClient.put(`/stocks-take-request/${id}`, params);
};

export const getOptionsUser = (deparment_id, params) => {
  return httpClient.get(`/stocks-take-request/user-of-deparment-options/${deparment_id}`, { params });
};

export const getStocks = (deparment_id, params) => {
  return httpClient.get(`/stocks-take-request/user-of-deparment-options/${deparment_id}`, { params });
};

export const getStocksTakeDetail = (id, params) => {
  return httpClient.get(`/stocks-take-type/for-take-request/${id}`, { params });
};

export const getListProduct = (params) => {
  return httpClient.get(`/stocks-take-request/list-product`, { params });
};

export const getListProductInventory = (stocks_take_request_id) => {
  return httpClient.get(`/stocks-take-request/get-inventory/${stocks_take_request_id}`);
};

export const executeStocksTakeRequestPeriod = (stocks_take_request_id) => {
  return httpClient.put(`/stocks-take-request/${stocks_take_request_id}/execute`);
};

export const updateConcludeContent = (stocks_take_request_id, payload) => {
  return httpClient.post(`/stocks-take-request/${stocks_take_request_id}/conclude`, payload);
};

export const getGenerateCode = () => {
  return httpClient.get(`/stocks-take-request/generate-code`);
};

export const getDataStocksManager = (stock_id) => {
  return httpClient.get(`/stocks-out-request/gen-data-stocks-manager/${stock_id}`);
};

export const reviewStocksTakeRequest = (params) => {
  return httpClient.post(`/stocks-take-request/approve-reject`, { ...params });
};

export const productStocksTakeImport = async (stockId, file) => {
  try {
    let formData = new FormData();

    formData.append('files', file);
    formData.append('stocks_id', stockId);
    // formData.append('data', JSON.stringify({ stock_id: stockId }));

    return httpClient.post('/stocks-take-request/product-stocks-take/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) { }
};

export const deleteStocksTake = (id) => {
  return httpClient.delete(`/stocks-take-request/${id}`);
};


import httpClient from 'utils/httpClient';

export const getList = (params = {}) => {
  return httpClient.get('/stocks-in-request', { params });
};
export const getOptionsStocksInRequest = (params) => {
  return httpClient.get('/stocks-in-request/get-options', { params });
};
export const deleteStocksInRequesst = (id) => {
  return httpClient.delete(`/stocks-in-request/${id}`);
};
export const deleteStocksInRequest = (list_id) => {
  return httpClient.delete(`/stocks-in-request`, { data: list_id });
};
export const getDetail = (id) => {
  return httpClient.get(`/stocks-in-request/${id}`);
};
export const create = (params) => {
  return httpClient.post(`/stocks-in-request`, params);
};
export const update = (id, params) => {
  return httpClient.put(`/stocks-in-request/${id}`, params);
};
export const genStocksInCode = (params = {}) => {
  return httpClient.get('/stocks-in-request/gen-stocks-code', { params });
};

export const getOptionsSupplier = (params) => {
  return httpClient.get('/supplier/get-options', { params });
};
export const getListUserRequest = (params) => {
  return httpClient.get('/stocks-in-request/get-user-request', { params });
};
export const getListStocksManager = (stocks_id, params) => {
  return httpClient.get(`/stocks-in-request/gen-data-stocks-manager/${stocks_id}`, { params });
};

export const getOptsProductCode = (params) => {
  return httpClient.get('/stocks-in-request/get-options-product-code', { params });
};

export const getProductOptions = (params) => {
  return httpClient.get('/stocks-in-request/product-options', { params });
};

export const getProductInit = (product_id, params) => {
  return httpClient.get(`/stocks-in-request/product/${product_id}`, { params });
};
export const getOptionsStocksInType = (params) => {
  return httpClient.get('/stocks-in-request/stocks-in-type/get-options', { params });
};
export const genLotNumber = (params = {}) => {
  return httpClient.get('/stocks-in-request/gen-lot-number', { params });
};

export const genCostValue = (cost_id, params) => {
  return httpClient.get(`/stocks-in-request/gen-cost-value/${cost_id}`, { params });
};

export const getInitialvalues = (params) => {
  return httpClient.get(`/stocks-in-request/init`, { params });
};
export const getOptionsStocksReviewLevel = (params) => {
  return httpClient.get('/stocks-in-request/get-review-level', { params });
};
export const approvedReview = (params) => {
  return httpClient.put('/stocks-in-request/approved-review', params);
};

export const exportPDF = (params) => {
  return httpClient.get('/stocks-in-request/export-pdf', { params });
};

export const upload = (file) => {
  let formData = new FormData();
  formData.append('productsImport', file);
  return httpClient.post('/stocks-in-request/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getOptionsCustomer = (params) => {
  return httpClient.get('/stocks-in-request/get-customer-list', { params });
};

export const createStocksDetail = (params) => {
  return httpClient.post(`/stocks-in-request/create-stocks-detail`, params);
};
export const downloadExcelFile = (params) => {
  const header = { responseType: 'blob' };
  return httpClient.post('/stocks-in-request/download-excel', params, header);
};
export const getInfoOfProductImeiCode = (params) => {
  return httpClient.get('/stocks-in-request/get-info-product-imei-code', { params });
};

export const checkImeiCode = (params) => {
  return httpClient.get('/stocks-in-request/check-imei-code', { params });
};

export const getStoreByBusinessId = (params) => {
  return httpClient.get('/stocks-in-request/get-store-options', { params });
};

export const getCustomerOptions = (params) => {
  return httpClient.get('/stocks-in-request/customer-options', { params });
};

export const updateImei = (params) => {
  return httpClient.post('/stocks-in-request/update-imei', params);
};

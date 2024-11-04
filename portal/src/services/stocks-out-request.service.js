import httpClient from 'utils/httpClient';

export const getOptionsStocksOutRequest = (params = {}) => {
  return httpClient.get('/stocks-out-request/get-options', { params });
};

export const getBusinessOptions = () => {
  return httpClient.get('/business/get-options');
};

export const getListDepartmentOptions = () => {
  return httpClient.get('/department/get-options');
};

export const getListSupplierOptions = () => {
  return httpClient.get('/supplier/get-options');
};

export const getListCustomerOptions = (params) => {
  return httpClient.get('/stocks-out-request/list-customer/deboune', { params });
};

export const getListCreateUserOptions = (params) => {
  return httpClient.get('/stocks-out-request/list-created-user/deboune', { params });
};

export const getOptionsStocks = (params) => {
  return httpClient.get('/stocks-out-request/get-options-stocks', { params });
};

export const getListReviewByStocksOutTypeId = (stocks_id) => {
  return httpClient.get('/stocks-out-request/list-reivew/' + stocks_id);
};

export const getDataStocksManager = (stock_id) => {
  return httpClient.get(`/stocks-out-request/gen-data-stocks-manager/${stock_id}`);
};

export const getStocksRequestCode = (id) => {
  return httpClient.get(`/stocks-out-request/gen-stocks-request-code/${id}`);
};

export const getOptionsListStockOuttypeRequest = () => {
  return httpClient.get('/stocks-out-request/list-stocks-out-type');
};

export const getUserBussinessDepartment = (bussiness_id, department_id) => {
  return httpClient.get(`/department/get-user/bussiness/${bussiness_id}/deparment/${department_id}`);
};

export const getProductImeiInventory = (params) => {
  return httpClient.get('/stocks-out-request/product/total-inventory', {
    params,
  });
};

export const getStoreWithDeboune = (params) => {
  return httpClient.get(`/store/deboune`, { params });
};

export const getProductOptionsDeboune = (params) => {
  return httpClient.get(`/stocks-out-request/product/get-options`, { params });
};

export const getOptionStocks = () => {
  return httpClient.get('/stocks-out-request/get-options-stocks');
};

export const getListStocksOut = (params = {}) => {
  return httpClient.get('/stocks-out-request', { params });
};

export const getDetailStocksOutRequest = (id) => {
  return httpClient.get(`/stocks-out-request/${id}`);
};
export const createStocksOutRequest = (params) => {
  return httpClient.post(`/stocks-out-request`, params);
};
export const updateStocksOutRequest = (id, params) => {
  return httpClient.put(`/stocks-out-request/${id}`, params);
};

export const deleteStocksOutRequest = (id, params) => {
  return httpClient.delete(`/stocks-out-request/${id}`, params);
};

export const reviewStocksOutRequest = (params) => {
  return httpClient.post(`/stocks-out-request/approve-reject`, { ...params });
};

export const exportPDFStocksOut = (data) => {
  return httpClient.get(`/stocks-out-request/export-pdf/${data}`);
};

export const exportTransport = (data) => {
  return httpClient.get(`/stocks-out-request/export-transport-pdf/${data}`);
};

export const stocksOutputed = (params) => {
  return httpClient.post(`/stocks-out-request/stocks-outputed`, { ...params });
};

export const deleteListStocksOut = (list_id = []) => {
  return httpClient.delete('/stocks-out-request', { data: { list_id } });
};

export const getProductByImei = (params) => {
  return httpClient.get('/stocks-out-request/product-by-imei', {
    params,
  });
};


export const getStocksOutRequestByOrder = (id) => {
  return httpClient.get(`/stocks-out-request/by-order/${id}`);
};

// create stocks out request by order id
export const createStocksOutRequestByOrderId = (params) => {
  return httpClient.post(`/stocks-out-request/create-by-order/${params?.order_id}`, params);
};

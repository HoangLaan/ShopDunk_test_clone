import httpClient from 'utils/httpClient';

const route = '/stocks-transfer';

export const getListStocksTransfer = (params = {}) => {
  return httpClient.get(route, { params });
};

export const create = (params = {}) => {
  return httpClient.post(route, params);
};

export const update = (id, params = {}) => {
  return httpClient.put(route + `/${id}`, params);
};

export const read = (id, params = {}) => {
  return httpClient.get(route + `/${id}`, { params });
};

export const getUserOpts = (params = {}) => {
  return httpClient.get(route + '/user-options', { params });
};

export const getSysUserOpts = (params = {}) => {
  return httpClient.get(route + '/sys-user-options', { params });
};

export const getStocksTransferTypeOpts = (params = {}) => {
  return httpClient.get('/stocks-transfer-type/get-options', { params });
};

export const getStocksOpts = (params) => {
  return httpClient.get('/stocks/get-options', { params });
};
export const deleteItem = (id, params = {}) => {
  return httpClient.delete(route + `/${id}`, params);
};

export const getListUser = (params) => {
  return httpClient.get('/user', { params });
};

export const genStocksTransferCode = (params = {}) => {
  return httpClient.get('/stocks-transfer/gen-stocks-transfer-code', { params });
};

export const getProductList = (params = {}) => {
  return httpClient.get(route + '/get-product-transfer', { params });
};

export const genReviewLevel = (id, params = {}) => {
  return httpClient.get(route + `/gen-review-level/${id}`, { params });
};

export const approvedReviewList = (params = {}) => {
  return httpClient.put(route + `/review-stocks-transfer`, params);
};

export const downloadExcelFile = (params) => {
  const header = { responseType: 'blob' };
  return httpClient.post(route + '/download-xcel-file', params, header);
};

export const uploadExcel = async (stockId, file) => {
  try {
    let formData = new FormData();

    formData.append('productimport', file);
    formData.append('data', JSON.stringify({ stock_id: stockId }));

    return httpClient.post(route + '/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) { }
};

export const exportPDF = (id, params = {}) => {
  return httpClient.get(route + `/export-pdf/${id}`, { params });
};

export const confirmTranfer = (id, params) => {
  return httpClient.put(route + `/confirm-transfer/${id}`, { params });
}

export const getProductTransferByImei = (params) => {
  return httpClient.get(route + `/get-product-transfer-imei`, { params });
};

export const getGeneralStocks = (params) => {
  return httpClient.get(route + `/get-general-stocks`, { params });
};

export const checkProductInventory = (params) => {
  return httpClient.post(route + `/check-product-inventory`, { params });
};

export const getInfoStocks = (params) => {
  return httpClient.get(route + `/get-info-stocks`, { params });
};

export const updateStatusTransfer = (params) => {
  return httpClient.post(route + `/update-status-transfer`, params);
};

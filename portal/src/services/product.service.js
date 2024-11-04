import httpClient from 'utils/httpClient.js';

const path = '/product';

export const getList = (params = {}) => httpClient.get(`${path}`, { params });
export const deleteProduct = (params) => {
  const ids = (params || []).map((x) => x.product_id);
  return httpClient.post(`${path}/delete`, { ids });
};

export const getDetail = (id) => httpClient.get(`${path}/${id}`);
export const create = (params) => httpClient.post(`${path}`, params);
export const update = (id, params) => httpClient.put(`${path}/${id}`, params);

export const getOptionsUnit = (params) => httpClient.get(`${path}/unit/get-options`, { params });
export const getOptionsOrigin = (params) => httpClient.get(`${path}/origin/get-options`, { params });
export const getOptionsManufacture = (params) => httpClient.get(`${path}/manufacture/get-options`, { params });
export const getListAttributes = (params) => httpClient.get(`${path}/attributes`, { params });
export const createAttribute = (params) => httpClient.post(`${path}/attributes`, params);

export const getOptionsStockType = (params) => httpClient.get(`${path}/stock-type/get-options`, { params });
export const getOptionsStock = (params) => httpClient.get(`${path}/stock/get-options`, { params });
// lấy Phiếu nhập theo kho
export const getOptionsStockInRequest = (params) => httpClient.get(`${path}/stock-in-request/get-options`, { params });
// export const getOptionsStore = (params) => httpClient.get(`${path}/store/get-options`, { params });
export const getOptionsStore = (params) => httpClient.get(`store/get-options`, { params });
export const getOptionsOuputType = (params) => httpClient.get(`${path}/output-type/get-options`, { params });
export const getOptionsArea = (params) => httpClient.get(`${path}/area/get-options`, { params });
export const getOptionsBusiness = (params) => httpClient.get(`${path}/business/get-options`, { params });
export const getOptionsProduct = (params) => httpClient.get(`${path}/get-options`, { params });

export const getListPrintBarcode = (params = {}) => httpClient.get(`${path}/barcode`, { params });
export const printBarcode = (params) => httpClient.post(`${path}/barcode`, params);

export const exportExcel = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/export-excel`, { params, ...header });
};

export const downloadTemplate = (_data) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/download-excel`, header);
};

export const importExcel = (file) => {
  let formData = new FormData();
  formData.append(`productimport`, file);
  return httpClient.post(`${path}/import-excel`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const printQRCode = (params) => httpClient.post(`${path}/qr`, params);
export const getManufacturerOptions = (params) => httpClient.get(`${path}/manufacturer-options`, params);

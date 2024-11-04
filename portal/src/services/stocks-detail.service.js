import httpClient from 'utils/httpClient';

const path = '/stocks-detail';

export const getList = (params) => {
  return httpClient.get(`${path}`, { params });
};

// export const getListDetail = (stocks_id,product_id) => {
//   return httpClient.get(`${path}/${stocks_id}/${product_id}`);
// };

export const getOptionsCategory = (params) => {
  return httpClient.get(`/product-category/get-options`, { params });
};

export const getOptionsModel = (params) => {
  return httpClient.get(`/product//model/get-options`, { params });
};

export const getOptionsProduct = (params) => {
  return httpClient.get(`${path}/get-options-product`, { params });
};

export const getListProductImeiCodeStocks = (params) => {
  return httpClient.get(`${path}/product-imei-code-in-stocks`, { params });
};

export const getOptionsUserImport = (params) => {
  return httpClient.get(`${path}/get-user-import`, { params });
};

export const getListRequestByProductImeiCode = (params) => {
  return httpClient.get(`${path}/get-request-by-imei`, { params });
};

export const getListIMEI = (params) => {
  return httpClient.get(`${path}/get-list-imei`, { params });
};

export const calculateOutStocks = (params) => {
  return httpClient.post(`${path}/calculate-out-stocks`, params);
};

export const getLastCalculateDate = () => {
  return httpClient.get(`${path}/last-calculate-date`);
};

export const createOrUpdateCogsSettings = (params = {}) => {
  return httpClient.post(`${path}/cogs-settings`, params);
};

export const getCogsSettings = () => {
  return httpClient.get(`${path}/cogs-settings`);
};

export const getStocksOptions = (params = {}) => {
  return httpClient.get(`${path}/stocks-options`, { params });
};

export const ExportExcelStock = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(path + `/export-excel`, { params, ...header });
};

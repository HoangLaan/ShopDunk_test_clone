import httpClient from 'utils/httpClient.js';
const path = '/discount-program-product';

export const getListDiscountProgramProduct = (params = {}) => {
  return httpClient.get(path, { params });
};

export const getDetailProduct = (params = {}) => {
  return httpClient.get(path + '/products', { params });
};

export const exportExcelDiscountProgramProduct = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/export-excel`, { params, ...header });
};

export const getManufacturerOptions = (params = {}) => {
  return httpClient.get(`${path}/manufacturer-options`, { params });
};

export const getProductOptions = (params = {}) => {
  return httpClient.get(`${path}/product-options`, { params });
};

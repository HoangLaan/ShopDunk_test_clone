import httpClient from 'utils/httpClient';

export const getList = (params) => {
  return httpClient.get('/product-category', { params });
};
export const deleteProductCategory = (params) => {
  const ids = (params || []).map((x) => x.product_category_id);
  return httpClient.post(`/product-category/delete`, { ids });
};
export const getDetail = (id) => {
  return httpClient.get(`/product-category/${id}`);
};
export const create = (params) => {
  return httpClient.post(`/product-category`, params);
};
export const update = (id, params) => {
  return httpClient.put(`/product-category/${id}`, params);
};
export const getOptionsTreeview = (params) => {
  return httpClient.get('/product-category/get-options-treeview', { params });
};
export const exportExcel = (params) => {
  const header = {
    responseType: 'blob',
  };
  return httpClient.get('/product-category/export-excel', { params, ...header });
};
export const getListAttributes = (params) => {
  return httpClient.get('/product-category/attributes', { params });
};
export const createAttribute = (params) => {
  return httpClient.post(`/product-category/attributes`, params);
};
export const getOptionsAttribute = (productCategoryId) => {
  return httpClient.get(`/product-category/${productCategoryId}/attributes/get-options`);
};
export const getOptionsModel = (params) => {
  return httpClient.get(`/product-category/${params?.productCategoryId}/product-model/get-options`, { params });
};
export const getMaterialById = (id) => {
  return httpClient.get(`/product-category/material/${id}`);
  //return httpClient.get(`/product-category/${params?.product_category_id}/product-model/get-options`, { params });
};

import httpClient from 'utils/httpClient.js';

const route = '/sl-prices';

export const getList = (params) => {
  return httpClient.get(route, { params });
};

export const create = (params) => {
  return httpClient.post(route, params);
};

export const update = (id, params) => {
  return httpClient.put(route + `/${id}`, params);
};

export const read = (id, params) => {
  return httpClient.get(route + `/${id}`, params);
};

export const deleteItem = (id, params = {}) => {
  return httpClient.delete(route + `/${id}`, params);
};

export const getStoreOpts = (params = {}) => {
  return httpClient.get(`/store`, { params });
};

export const getListProduct = (params = {}) => {
  return httpClient.get(route + `/prices-list`, { params });
};

export const areaByOutputTypeOpts = (params = {}) => {
  return httpClient.get(route + `/list-area-by-output-type`, { params });
};

export const getBusinessOfAreaOpts = (params = {}) => {
  return httpClient.get(route + `/list-business-by-area`, { params });
};

export const readDetialOuputType = (id, params = {}) => {
  return httpClient.get(`/output-type/${id}`, { params });
};
// Lấy chi tiết giá sản phẩm hoặc của nguyên liệu
export const detailProduct = (id, params = {}) => {
  return httpClient.get(route + `/product/${id}`, { params });
};
// Lấy chi tiết các thuộc tính của model
export const detailModelAttribute = (params = {}) => {
  return httpClient.get(route + `/model/attribute`, { params });
};
// Lấy chi tiết giá sản phẩm
export const detailPrices = (id, params = {}) => {
  return httpClient.get(route + `/${id}`, { params });
};

// Lấy chi tiết giá theo sản phẩm
export const detailPriceProduct = (id, params = {}) => {
  return httpClient.get(route + `/option/product/${id}`, { params });
};
// Lấy chi tiết giá sản phẩm theo tùy chọn
export const detailPricesByOption = (id, params = {}) => {
  return httpClient.get(route + `/option/${id}`, { params });
};
// Duyệt giá cho sản phẩm
export const reviewPrices = (id, params = {}) => {
  return httpClient.put(route + `/${id}/review`, { ...params });
};
// danh sách lịch sử giá sản phẩm
export const getListPriceProductHistory = (params = {}) => {
  return httpClient.get(route + `/prices-list/history`, { params });
};
// Lưu danh sách áp dụng điều chỉnh giá
export const changePriceMultiProduct = (params = {}) => {
  return httpClient.post(route + `/prices-list`, params);
};

export const downloadTemplate = (_data) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${route}/download-excel`, header);
};

export const importExcel = (file) => {
  let formData = new FormData();
  formData.append(`priceimport`, file);
  return httpClient.post(`${route}/import-excel`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

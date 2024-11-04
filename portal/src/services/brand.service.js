import httpClient from 'utils/httpClient.js';

export const getListBrand = (params) => {
  return httpClient.get('/brand', { params });
};

export const createBrand = (params) => {
  return httpClient.post('/brand', params);
};

export const updateBrand = (id, params) => {
  return httpClient.put(`/brand/${id}`, params);
};

export const getDetail = (id) => {
  return httpClient.get(`/brand/${id}`);
};

export const deleteBrand = (params) => {
  let ids;
  if (Array.isArray(params)) {
    ids = (params || []).map((x) => x.brand_id).join(',');
  } else {
    ids = `${params}`;
  }
  return httpClient.delete(`/brand/delete`, { data: { ids } });
};

export const getListCompany = (params) => {
  return httpClient.get('/brand/company-options', { params });
};

export const getOptionsBrand = (params = {}) => {
  return httpClient.get(`brand/get-options`, { params });
};

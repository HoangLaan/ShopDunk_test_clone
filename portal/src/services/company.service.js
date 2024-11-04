import httpClient from 'utils/httpClient.js';

const path = '/company';

export const getCompanyOptions = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};
export const deleteCompany = (id) => {
  return httpClient.delete(`${path}/${id}`);
};
export const getOptionsForUser = (_data = {}) => {
  return httpClient.get(`${path}/get-options/user`, _data);
};
export const getOptionsCompany = (_data = {}) => {
  return httpClient.get(`${path}/get-options`, _data);
};
export const getDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};
export const create = (params) => {
  return httpClient.post(`${path}`, params);
};
export const update = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};
export const getBankAccountOptions = (company_id) => {
  return httpClient.get(`${path}/${company_id}/bank-account/get-options`);
};

import httpClient from 'utils/httpClient.js';

const path = '/commission';

export const getListCommission = (params) => {
  return httpClient.get(`${path}`, { params });
};

export const createCommission = (_data) => {
  return httpClient.post(`${path}`, _data);
};

export const updateCommission = (id, _data) => {
  return httpClient.put(`${path}/${id}`, _data);
};

export const stopCommission = (id, _data) => {
  return httpClient.put(`${path}/${id}/stop`, _data);
};

export const deleteCommission = (id) => {
  return httpClient.delete(`${path}/${id}`);
};

export const delCommission = (ids = []) => {
  return httpClient.post(`${path}/delete`, { ids });
};

export const getCommissionCompanyOptions = () => {
  return httpClient.get(`${path}/company/get-options`);
};

export const getCommissionDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const getOptionsOrderType = () => {
  return httpClient.get(`/order-type?is_active=1`);
};

export const getDepartmentPosition = (params) => {
  return httpClient.get(`${path}/department-position`, { params });
};

export const getDepartmentPositionV2 = (params) => {
  return httpClient.get(`${path}/department-position-v2`, { params });
};

export const getUserDepartmentOptions = (params) => {
  return httpClient.get(`${path}/user-department-options`, { params });
};

// Duyệt hoa hồng
export const reviewCommissions = (params = {}) => {
  return httpClient.put(`${path}/review`, { ...params });
};

import httpClient from 'utils/httpClient';

export const getList = (_data = {}) => {
  return httpClient.get('/department', _data);
};
export const getOptionsDepartment = (params) => {
  return httpClient.get('/department/get-options', { params });
};
export const getOptionsCompany = () => {
  return httpClient.get('/company', { params: { is_active: 1 } });
};

export const getListDepartment = (params = {}) => {
  return httpClient.get('/department', { params });
};

export const getDetailDepartment = (id) => {
  return httpClient.get(`/department/${id}`);
};
export const createDepartment = (params) => {
  return httpClient.post(`/department`, params);
};
export const updateDepartment = (id, params) => {
  return httpClient.put(`/department/${id}`, params);
};

export const deleteDepartment = (id, params) => {
  return httpClient.delete(`/department/${id}`, params);
};

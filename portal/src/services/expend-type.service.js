import httpClient from 'utils/httpClient.js';

export const getExpendTypeList = (params = {}) => {
  return httpClient.get('/expend-type', { params });
};

export const getDetailExpendType = (id) => {
  return httpClient.get(`/expend-type/${id}`);
};
export const createExpendType = (params) => {
  return httpClient.post(`/expend-type`, params);
};
export const updateExpendType = (id, params) => {
  return httpClient.put(`/expend-type/${id}`, params);
};

export const deleteExpendType = (list_id = []) => {
  return httpClient.delete(`/expend-type`, { data: { list_id } });
};

export const getExpendTypeOptions = (params) => {
  return httpClient.get('/expend-type/get-options', { params });
};

export const getCompanyOptions = (params) => {
  return httpClient.get('/expend-type/get-company-options', { params });
};

export const getBusinessOptions = (params) => {
  return httpClient.get(`/expend-type/get-business-options`, { params });
};

export const getUserOptions = (params) => {
  return httpClient.get(`/expend-type/get-user-options`, { params });
};

export const getDepartmentOptions = (params) => {
  return httpClient.get(`/expend-type/get-department-options`, { params });
};

export const getReviewLevelList = (params) => {
  return httpClient.get(`/expend-type/review-level`, { params });
};

export const getPositionOptions = (params) => {
  return httpClient.get(`/expend-type/get-position-options`, { params });
};

export const createReviewLevel = (params) => {
  return httpClient.post(`/expend-type/review-level`, params);
};

export const deleteReviewLevel = (list_id = []) => {
  return httpClient.delete(`/expend-type/review-level`, { data: { list_id } });
};

// BankAccount
export const getBankAccountList = (params = {}) => {
  return httpClient.get('/expend-type/bank-account', { params });
};

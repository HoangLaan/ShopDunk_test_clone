import httpClient from 'utils/httpClient.js';

const path = '/payroll-template';

export const getPayrollTemplateList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getPayrollTemplateDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createPayrollTemplate = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updatePayrollTemplate = (params) => {
  return httpClient.patch(`${path}`, params);
};

export const deletePayrollTemplate = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getSalaryElementList = (params = {}) => {
  return httpClient.get(`${path}/salary-element`, { params });
};

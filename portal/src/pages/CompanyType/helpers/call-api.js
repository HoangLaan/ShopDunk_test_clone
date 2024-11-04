import httpClient from 'utils/httpClient';

export const getListCompanyType = (params) => {
  return httpClient.get('/company-type', { params });
};

export const createCompanyType = (params) => {
  return httpClient.post('/company-type', params);
};

export const updateCompanyType = (id, params) => {
  return httpClient.put(`/company-type/${id}`, params);
};

export const getDetail = (id) => {
  return httpClient.get(`/company-type/${id}`);
};

export const deleteCompanyType = (company_type_id) => {
  return httpClient.delete(`/company-type/${company_type_id}`);
};

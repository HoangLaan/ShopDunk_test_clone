import httpClient from 'utils/httpClient';

export const getListHrSalary = (params = {}) => {
  return httpClient.get('/hr-salary', { params });
};

export const delHrSalary = (list_id = []) => {
  return httpClient.delete('/hr-salary', { data: { list_id } });
};

export const createHrSalary = (values) => {
  return httpClient.post(`/hr-salary`, values);
};

export const updateHrSalary = (values) => {
  return httpClient.put(`/hr-salary`, values);
};

export const getDetaiHrSalary = (id) => {
  return httpClient.get(`/hr-salary/${id}/detail`);
};

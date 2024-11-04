import httpClient from 'utils/httpClient.js';

const path = '/budget-plan';

export const create = (params) => {
  return httpClient.post(`${path}`, params);
};

export const getByID = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const getOldTotalBudgetPlan = () => {
  return httpClient.get(`${path}/total`);
};

export const getBudgetPlanDetailByID = (id) => {
  return httpClient.get(`${path}/detail/${id}`);
};

export const getBudgetByDepartment = (id, params) => {
  return httpClient.get(`${path}/${id}/department`, { params });
};


export const getBudgetDetailPerMonth = (params) => {
  return httpClient.get(`${path}/distribution/month`, { params });
};

export const createTransferBudgetPlan = (body) => {
  console.log(body)
  return httpClient.post(`${path}/transfer`, body);
};



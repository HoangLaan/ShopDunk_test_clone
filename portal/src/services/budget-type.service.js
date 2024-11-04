import httpClient from 'utils/httpClient.js';

const path = '/budget-type';

export const createBudgetType = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateBudgetType = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const getListBudgetType = (params) => {
  return httpClient.get(`${path}`, {params});
};

export const getDetailBudgetType = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const deleteByID = (id) => {
  return httpClient.delete(`${path}/${id}`);
};

export const deleteListBudgetType = (list_id = []) => {
  return httpClient.delete(`${path}`, {data: {list_id}});
};


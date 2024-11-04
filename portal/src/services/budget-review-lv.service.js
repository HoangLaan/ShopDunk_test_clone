import httpClient from 'utils/httpClient.js';

const path = '/budget-review-lv';

export const createBudgetReviewLevel = (params) => {
  return httpClient.post(`${path}`, params);
};

export const getListBudgetReviewLv = (params) => {
  return httpClient.get(`${path}`, {params});
};

export const getListUserReviewLv = (params) => {
  return httpClient.get(`${path}/users`,{params});
};

export const deleteReviewLv = id => {
  return httpClient.delete(`${path}/${id}`);
};



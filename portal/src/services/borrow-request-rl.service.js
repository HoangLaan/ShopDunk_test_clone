import httpClient from 'utils/httpClient.js';

const path = '/borrow-review-lv';

export const create = (params) => {
  return httpClient.post(`${path}`, params);
};

export const getListBorrowReviewLv = (params) => {
  return httpClient.get(`${path}`,{params});
};

export const getOptionsReviewUser = (params) => {
  return httpClient.get(`${path}/users`,{params});
};

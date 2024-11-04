import httpClient from 'utils/httpClient.js';

const path = '/borrow-request';

export const getListReviewByType = (params) => {
  return httpClient.get(`${path}/get-list-review`, { params });
};

const getListBorrowRequest = (params) => {
  return httpClient.get(`${path}`, { params });
};

export const createBorrowRequest = (payload = {}) => {
  return httpClient.post(`${path}`, payload);
};

export const updateBorrowRequest = (payload = {}) => {
  return httpClient.post(`${path}`, payload);
};

export const getDetailBorrowRequest = (id, params) => {
  return httpClient.get(`${path}/${id}`, { params });
};

export const deleteBorrowRequest = (list_id) => {
  return httpClient.delete(`${path}`, { data: list_id });
};


// Duyệt giá cho mượn hàng
export const reviewBorrowRequest = (id, params = {}) => {
  return httpClient.put(`${path}/${id}/review`, { ...params });
};

const BorrowRequestService = {
  getListBorrowRequest,
  createBorrowRequest,
  updateBorrowRequest,
  getDetailBorrowRequest,
  deleteBorrowRequest,
  reviewBorrowRequest,
};

export default BorrowRequestService;

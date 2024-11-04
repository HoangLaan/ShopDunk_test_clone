import httpClient from 'utils/httpClient';

export const getListPurchaseRequisition = (params = {}) => {
  return httpClient.get('/purchase-requisition', { params });
};

export const getDetailPurchaseRequisition = (id) => {
  return httpClient.get(`/purchase-requisition/${id}`);
};

export const createPurchaseRequisition = (payload) => {
  const _payload = {
    document_url: payload.document_url,
    fields: JSON.stringify(payload),
  };
  return httpClient.post('/purchase-requisition', _payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updatePurchaseRequisition = (payload) => {
  const _payload = {
    document_url: payload.document_url,
    fields: JSON.stringify(payload),
  };
  return httpClient.put('/purchase-requisition', _payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deletePurchaseRequisition = (list_id = []) => {
  return httpClient.delete('/purchase-requisition', { data: { list_id } });
};

export const getStoreOptions = (params) => {
  return httpClient.get('/store/get-options', { params });
};

export const exportPDF = (id, params = {}) => {
  return httpClient.get(`/purchase-requisition/export-pdf/${id}`, { params });
};

export const getUserOptions = (params) => {
  return httpClient.get('/purchase-requisition/get-user-options', { params });
};

const getDepartmentOptions = (params) => {
  return httpClient.get('/purchase-requisition/get-department-options', { params });
};

const getReviewLevelList = (params) => {
  return httpClient.get('/purchase-requisition/review-level', { params });
};

const getPositionOptions = (params) => {
  return httpClient.get('/purchase-requisition/get-position-options', { params });
};

const createReviewLevel = (params) => {
  return httpClient.post('/purchase-requisition/review-level', params);
};

const deleteReviewLevel = (list_id = []) => {
  return httpClient.delete('/purchase-requisition/review-level', { data: { list_id } });
};

export const updateReview = (payload) => {
  return httpClient.post('/purchase-requisition/review', payload);
};

const getReviewInformation = (params) => {
  return httpClient.get('/purchase-requisition/get-detail-review', { params });
};

export const getListCountPrStatus = (params) => {
  return httpClient.get(`/purchase-requisition/count`, { params });
};

const purchaseRequisitionService = {
  getUserOptions,
  getDepartmentOptions,
  getReviewLevelList,
  getPositionOptions,
  createReviewLevel,
  deleteReviewLevel,
  updateReview,
  getReviewInformation,
  getListCountPrStatus,
};

export default purchaseRequisitionService;

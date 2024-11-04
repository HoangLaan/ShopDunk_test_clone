import httpClient from 'utils/httpClient';

export const getListPaymentSlip = (params = {}) => {
  return httpClient.get('/payment-slip', { params });
};
export const getOptionsPaymentSlip = (params) => {
  return httpClient.get('/payment-slip/get-options', { params });
};
export const getDetailPaymentSlip = (id) => {
  return httpClient.get(`/payment-slip/${id}`);
};
export const createPaymentSlip = (params) => {
  return httpClient.post(`/payment-slip`, params);
};
export const updatePaymentSlip = (params) => {
  return httpClient.put(`/payment-slip`, params);
};
export const deletePaymentSlip = (payment_slip_id) => {
  return httpClient.delete(`/payment-slip/${payment_slip_id}`);
};
export const getOptionsExpendType = (params) => {
  return httpClient.get('/payment-slip/expend-type', { params });
};
export const getCashierByCompanyId = (params) => {
  return httpClient.get('/payment-slip/get-cashier', { params });
};

export const getListOrders = (params = {}) => {
  return httpClient.get('/payment-slip/get-list-order', { params });
};
export const genPaymentSlipCode = (params = {}) => {
  return httpClient.get('/payment-slip/gen-code', { params });
};

export const uploadPaymentSlipFile = (file, onUploadProgress) => {
  let formData = new FormData();
  formData.append('files', file);
  return httpClient.post('/payment-slip/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const exportPDF = (params) => {
  return httpClient.get('/payment-slip/export-pdf', { params });
};
export const getReviewLevel = (params) => {
  return httpClient.get('/payment-slip/get-review-level', { params });
};

export const approvedReview = (params) => {
  return httpClient.put(`/payment-slip/${params.payment_slip_id}/approved-review-list`, params);
};

export const deleteFile = (data) => {
  return httpClient.delete(`/payment-slip/file/${data.file_id}/module/${data.file_module_id}`, data);
};

export const downloadFile = (file_id) => {
  return httpClient.post(`/payment-slip/download-file/${file_id}`, {}, { responseType: 'blob' });
};

export const getInvoiceOptions = (params = {}) => {
  return httpClient.get(`/payment-slip/invoice-options`, { params });
};

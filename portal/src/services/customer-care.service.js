import httpClient from 'utils/httpClient';

const getList = async (params) => {
  return httpClient.get('/customer-care', { params });
};

const getOptionsCustomerType = (params) => {
  return httpClient.get('/customer-type/get-options', { params });
};

const getOptionsOrderStatus = (params) => {
  return httpClient.get('/customer-care/get-options-order-type', { params });
};

const exportExcel = (payload) => {
  return httpClient.post('/customer-care/export-excel', payload, { responseType: 'blob' });
};

const exportExcelS = (payload) => {
  return httpClient.post('/static-content/export-excel', payload, { responseType: 'blob' });
};

const exportExcelB = (payload) => {
  return httpClient.post('/appointments/export-excel', payload, { responseType: 'blob' });
};
const exportExcelReview = (payload) => {
  return httpClient.post('/comment/export-excel', payload, { responseType: 'blob' });
};

const exportExcelWebSite = (payload) => {
  return httpClient.post('/menu-website/export-excel', payload, { responseType: 'blob' });
};

const CustomerCareService = {
  getList,
  getOptionsCustomerType,
  getOptionsOrderStatus,
  exportExcel,
  exportExcelS,
  exportExcelB,
  exportExcelReview,
  exportExcelWebSite,
};

export default CustomerCareService;

import httpClient from 'utils/httpClient';

const path = '/customer-deposit';
const getList = (params) => {
  return httpClient.get(path, { params });
};

const updateCall = (payload) => {
  return httpClient.post('/customer-deposit/call', payload);
};

export const exportExcel = (params) => {
  return httpClient.post(`${path}/export-excel`, params, { responseType: `blob` });
};

const customerDepositService = {
  getList,
  exportExcel,
  updateCall,
};

export default customerDepositService;

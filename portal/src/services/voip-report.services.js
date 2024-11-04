import httpClient from 'utils/httpClient.js';

export const getListVoipReport = (params = {}) => {
  return httpClient.get('/voip-report', { params });
};

export const exportExcel = (params) => {
  console.log("🚀 ~ file: voip-report.services.js:8 ~ exportExcel ~ params:", params)
  return httpClient.post(`/voip-report/export-excel`, params, {responseType: `blob`});
};

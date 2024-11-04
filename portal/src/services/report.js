import httpClient from 'utils/httpClient.js';

export const getListReport = (params = {}) => {
    return httpClient.get('/report', { params });
  };

export const exportExcel = (params = {}) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get('/report/export', { params, ...header });
};

export const getListReportAccounting = (params = {}) => {
    return httpClient.get('/report/accounting', { params });
};

export const exportReportAccounting = (params = {}) => {
  const header = {
    responseType: `blob`,
  };
    return httpClient.get('/report/export-accounting', { params, ...header });
};
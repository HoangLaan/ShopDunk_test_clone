import httpClient from 'utils/httpClient';

const path = '/accounting-detail';

export const getList = (params = {}) => {
  return httpClient.get(path, { params });
};

export const exportExcel = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(path + '/export-excel', { params, ...header });
};

export const exportPDF = (params) => {
  return httpClient.get(path + '/export-pdf', { params });
};

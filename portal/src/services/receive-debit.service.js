import httpClient from 'utils/httpClient';

const path = '/receive-debit';

export const getList = (params = {}) => {
  return httpClient.get(path, { params });
};

export const getDetail = (params) => {
  return httpClient.get(`${path}/detail`, { params });
};

export const exportExcel = (body) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.post(path + '/export-excel', body, header);
};

export const exportExcelDetail = (body) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.post(path + '/export-excel-detail', body, header);
};

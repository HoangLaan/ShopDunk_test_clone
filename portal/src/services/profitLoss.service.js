import httpClient from 'utils/httpClient';

const route = '/profit-loss';

const getList = (params) => {
  return httpClient.get(route, { params });
};

const getHistoryList = (params) => {
  return httpClient.get(route + '/history', { params });
};

const create = (body) => {
  return httpClient.post(route, body);
};

export const exportExcel = (body) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.post(route + '/export-excel', body, header);
};

export const exportHistoryExcel = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(route + '/export-history-excel', { ...params, ...header });
};

const profitLossService = {
  getList,
  create,
  exportExcel,
  getHistoryList,
  exportHistoryExcel,
};

export default profitLossService;

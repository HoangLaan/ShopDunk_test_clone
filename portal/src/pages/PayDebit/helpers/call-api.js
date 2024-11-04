import httpClient from 'utils/httpClient';
const path = '/debit';

export const getListDebit = (params) => {
  return httpClient.get(`${path}/pay`, { params });
};

export const deleteDebit = (list_id) => {
  return httpClient.delete(`${path}`, { data: list_id });
};

export const getListReceiveSlip = (id) => {
  return httpClient.get(`${path}/pay/${id}`);
};

export const exportExcel = (params) => {
  return httpClient.post(`${path}/export-excel`, params, { responseType: `blob` });
};

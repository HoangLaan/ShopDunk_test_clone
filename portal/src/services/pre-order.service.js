import httpClient from 'utils/httpClient';

const path = '/pre-order';
export const getDatHisBuyIP = (params = {}) => {
  return httpClient.get(`${path}/his-buy-ip`, { params });
};

export const getDatHisBuyIP15 = (params = {}) => {
  return httpClient.get(`${path}/his-buy-ip-15`, { params });
}

export const getInterestCus = (params = {}) => {
  return httpClient.get(`${path}/interest`, { params });
};

export const exportExcel = (params) => {
  return httpClient.post(`${path}/export-excel`, params, {responseType: `blob`});
};


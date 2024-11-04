import httpClient from 'utils/httpClient.js';

const route = '/onepay';

export const getInstallmentBanks = (params) => {
  return httpClient.get(route + '/installment-bank', { params });
};

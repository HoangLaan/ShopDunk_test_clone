import api from 'utils/httpClient';

const route = '/purchase-order-division';

export const getProStocksInventory = (params = {}) => {
  return api.post(route + '/pro-stocks-inventory', params);
};

export const getHistoryOrderList = (params = {}) => {
    return api.post(route + '/history-order', params);
  };


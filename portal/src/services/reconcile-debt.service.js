import httpClient from 'utils/httpClient';

const path = '/reconcile-debit';

export const loadData = (params = {}) => {
  return httpClient.get(path + '/load-data', { params });
};

export const execute = (payload = {}) => {
  return httpClient.post(path + '/execute', payload);
};

export const getHistoryList = (params = {}) => {
  return httpClient.get(path + '/history', { params });
};

export const revertReconcile = (payload = {}) => {
  return httpClient.post(path + '/revert', payload);
};

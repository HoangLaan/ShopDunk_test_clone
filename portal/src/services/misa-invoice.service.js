import httpClient from 'utils/httpClient.js';

const path = '/misa-invoice';

export const createInvoice = (bodyData) => {
  return httpClient.post(path + '/publish-with-hsm', bodyData);
};

export const viewInvoice = (transactionId) => {
  return httpClient.get(path + '/view/' + transactionId);
};

export const dowloadInvoice = (transactionId) => {
  return httpClient.post(path + '/dowload/' + transactionId);
};

export const saveAndUpdateInvoice = (bodyData) => {
  return httpClient.post(path + '/save-invoice', bodyData);
};

export const viewDemo = (bodyParams, storeId) => {
  return httpClient.post(path + `/view-demo?store_id=${storeId}`, bodyParams);
};

export const viewDemoStocksOut = (bodyParams, query) => {
  return httpClient.post(path + `/view-demo-transport?stocks_id=${query.stocks_id}`, bodyParams);
};

export const exportStocksOut = (bodyParams, query) => {
  return httpClient.post(path + `/publish-transport-hsm?stocks_id=${query.stocks_id}`, bodyParams);
};

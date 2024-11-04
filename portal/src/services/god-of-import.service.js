import httpClient from 'utils/httpClient.js';

const path = '/god-of-import';

export const importStockInRequest = (file) => {
  let formData = new FormData();
  formData.append(`file`, file);
  return httpClient.post(`${path}/import-stock-in-request`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const importOrder = (file) => {
  let formData = new FormData();
  formData.append(`file`, file);
  return httpClient.post(`${path}/import-order`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const importReceiveSlip = (file) => {
  let formData = new FormData();
  formData.append(`file`, file);
  return httpClient.post(`${path}/import-receive-slip`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
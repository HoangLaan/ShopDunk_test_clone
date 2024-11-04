import httpClient from 'utils/httpClient';

const path = '/purchase-invoice';

export const create = (params) => {
  return httpClient.post(path, params);
};
export const update = (params) => {
  return httpClient.put(path, params);
};

export const getList = (params = {}) => {
  return httpClient.get(path, { params });
};

export const getDetail = (id, params = {}) => {
  return httpClient.get(`${path}/${id}`, { params });
};

export const cancelInvoie = (id) => {
  return httpClient.put(`${path}/cancel/${id}`);
};

const PurchaseInvoiceService = {
  create,
  update,
  getList,
  getDetail,
  cancelInvoie,
};

export default PurchaseInvoiceService;

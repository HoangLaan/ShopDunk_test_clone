import httpClient from 'utils/httpClient';
const path = '/ledger';

export const getListLedger = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getDetailLedger = (id, params) => {
  return httpClient.get(`${path}/${id}`, { params });
};

export const exportExcelLedger = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/export-excel`, { params, ...header });
};

export const createLedger = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateLedger = (receive_slip_id, params) => {
  return httpClient.put(`${path}/${receive_slip_id}`, params);
};

export const getCashierByCompanyId = (params) => {
  return httpClient.get(`${path}/get-cashier`, { params });
};

export const getOptionsBanks = (params = {}) => {
  return httpClient.get(`${path}/get-bank`, { params });
};

export const deleteLedger = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const genLedgerCode = (params = {}) => {
  return httpClient.get(`${path}/gen-code`, { params });
};

export const getAccountingAccount = () => {
  return httpClient.get(`${path}/get-accounting-account`);
};

export const uploadLedgerFile = (file, onUploadProgress) => {
  let formData = new FormData();
  formData.append('files', file);
  return httpClient.post(`${path}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};
export const exportPDF = (params) => {
  return httpClient.get(`${path}/export-pdf`, { params });
};

export const deleteFile = (data) => {
  return httpClient.delete(`${path}/file/${data.file_id}/module/${data.file_module_id}`, data);
};

export const downloadTemplate = (_data) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/download-excel`, header);
};

export const importExcel = (file) => {
  let formData = new FormData();
  formData.append(`ledgerimport`, file);
  return httpClient.post(`${path}/import-excel`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

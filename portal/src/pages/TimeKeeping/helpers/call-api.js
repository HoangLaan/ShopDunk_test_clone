import httpClient from 'utils/httpClient';

const route = '/time-keeping';

export const getDepartmentOpts = (params = {}) => {
  return httpClient.get('/department/get-options', { params });
};

export const getBusinessOpts = (params = {}) => {
  return httpClient.get('/business/get-options', { params });
};

export const getStoreOpts = (params = {}) => {
  return httpClient.get('/store/get-options', { params });
};

export const getList = (params = {}) => {
  return httpClient.get(route, { params });
};

export const updateTimeKeeping = (params = {}) => {
  return httpClient.post(route + '/create-time-keeping', params);
};

export const exportExcel = (opts) => {
  const header = { responseType: 'blob' };
  return httpClient.post(route + '/export-excel', opts, header);
};

export const exportExcelTimeKeeping = (opts) => {
  const header = { responseType: 'blob' };
  return httpClient.post(route + '/export-excel-time-keeping', opts, header);
};

export const exportExcelAllUser = (opts) => {
  const header = { responseType: 'blob' };
  return httpClient.post(route + '/export-excel-all-user', opts, header);
};

export const updateCofirmTimeKeeping = (params) => {
  return httpClient.post(route + '/time-keeping-list', params);
};

export const getShiftOpts = (params) => {
  return httpClient.get(route + '/option', params);
};

export const getListShiftQC = (params) => {
  return httpClient.get(route + '/shift-qc', { params });
};


export const getListBrokenShift = (params) => {
  return httpClient.get(route + '/shift-broken-shift', { params });
};




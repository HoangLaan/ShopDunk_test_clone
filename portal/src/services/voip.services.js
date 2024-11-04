import httpClient from 'utils/httpClient.js';

export const getListCdrs = (params = {}) => {
  return httpClient.get('/voip/cdrs', { params });
};
export const syncCdrs = (id) => {
  return httpClient.post(`/voip/sync-cdrs/${id}`);
};

export const createNoteVoip = (data) => {
  return httpClient.post('/crm-note-phonenumber', data);
};

export const getListNoteVoip = (params) => {
  return httpClient.get('/crm-note-phonenumber', { params });
};

export const getTaskWithVoip = (params) => {
  return httpClient.get(`/task/voip`, { params });
};

export const getShiftInfo = () => {
  return httpClient.get(`/user/shift-info`);
};

export const transferCall = (data) => {
  return httpClient.post(`/voip/transfer`, data);
};

export const recallUpdateVoip = (data) => {
  return httpClient.post(`/voip/recall-update`, data);
};

export const exportExcel = (params) => {
  return httpClient.post(`/voip/export-excel`, params, { responseType: `blob` });
};

export const getVoipExt = (params) => {
  return httpClient.get(`/voip/voip-ext`, { params });
};

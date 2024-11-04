import httpClient from 'utils/httpClient';

export const getOptionsManufacturer = (params = {}) => {
  return httpClient.get('/manufacturer/get-options', { params });
};

export const getListManufacturer = (params = {}) => {
  return httpClient.get('/manufacturer', { params });
};
export const getOptionsBusiness = (params) => {
  return httpClient.get('/manufacturer/get-options', { params });
};

export const getDetailManufacturer = (id) => {
  return httpClient.get(`/manufacturer/${id}`);
};
export const createManufacturer = (params) => {
  return httpClient.post(`/manufacturer`, params);
};
export const updateManufacturer = (id, params) => {
  return httpClient.put(`/manufacturer/${id}`, params);
};

export const deleteManufacturer = (list_id = []) => {
  return httpClient.delete(`/manufacturer`, { data: { list_id } });
};

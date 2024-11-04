import httpClient from 'utils/httpClient.js';

export const getListCluster = (params = {}) => {
  return httpClient.get('/cluster', { params });
};
export const getDetailCluster = (id) => {
  return httpClient.get(`/cluster/${id}`);
};
export const createCluster = (params) => {
  return httpClient.post(`/cluster`, params);
};
export const updateCluster = (id, params) => {
  return httpClient.put(`/cluster/${id}`, params);
};

export const deleteCluster = (list_id = []) => {
  return httpClient.delete(`/cluster`, { data: { list_id } });
};

export const getOptionsCluster = (params) => {
  return httpClient.get('/cluster/get-options', { params });
};

export const getListStore = (params) => {
  return httpClient.get('/cluster/get-stores', { params });
};

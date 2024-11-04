import httpClient from 'utils/httpClient.js';

export const getListEquipmentGroup = (params = {}) => {
  return httpClient.get('/equipment-group', { params });
};
export const getDetailEquipmentGroup = (id) => {
  return httpClient.get(`/equipment-group/${id}`);
};
export const createEquipmentGroup = (params) => {
  return httpClient.post(`/equipment-group`, params);
};
export const updateEquipmentGroup = (id, params) => {
  return httpClient.put(`/equipment-group/${id}`, params);
};

export const deleteEquipmentGroup = (list_id = []) => {
  return httpClient.delete(`/equipment-group`, { data: { list_id } });
};

export const getOptionsEquipmentGroup = (params) => {
  return httpClient.get('/equipment-group/group-options', { params });
};

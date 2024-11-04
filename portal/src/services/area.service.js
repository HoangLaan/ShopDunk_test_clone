import httpClient from 'utils/httpClient';

const path = '/area';

export const getAreaOptions = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
}

export const getOptionsArea = (params = {}) => {
  return httpClient.get('/area/get-options', { params });
};

export const getList = (params = {}) => {
  return httpClient.get('/area', { params });
};
export const getOptionsBusiness = (params) => {
  return httpClient.get('/area/get-options', { params });
};

export const getDetailArea = (id) => {
  return httpClient.get(`/area/${id}`);
};
export const createArea = (params) => {
  return httpClient.post(`/area`, params);
};
export const updateArea = (id, params) => {
  return httpClient.put(`/area/${id}`, params);
};

export const deleteArea = (id, params) => {
  return httpClient.delete(`/area/${id}`, params);
};

export const deleteListArea = (list_id = []) => {
  return httpClient.delete('/area', { data: { list_id } });
};

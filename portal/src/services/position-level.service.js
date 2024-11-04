import api from 'utils/httpClient';

export const getListPositionLevel = (params = {}) => {
  return api.get('/position-level', { params });
};

export const deletePositionLevel = (ids = []) => {
  return api.delete('/position-level', { data: { ids } });
};

export const createPositionLevel = (values) => {
  return api.post(`/position-level`, values);
};

export const updatePositionLevel = (values) => {
  return api.patch(`/position-level`, values);
};

export const getDetailPositionLevel = (id) => {
  return api.get(`/position-level/${id}`);
};

export const getOptionsPositionLevel = (params) => {
  return api.get('/position-level/get-options', { params });
};
export const getOptionByPositionId = (params) => {
  return api.get('/position-level/get-options-by-position', { params });
};

import api from 'utils/httpClient';
const path = '/member-point';
export const getListExchangePointApplyOnOrder = (_data = {}) => {
  return api.post(`${path}/get-exchange-point`, _data);
};
export const getPointOfUser = (id) => {
  return api.get(`${path}/${id}`);
};

export const getListPointOfUser = (params) => {
  return api.get(`${path}/get-of-user`, { params });
};

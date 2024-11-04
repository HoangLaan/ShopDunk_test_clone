import httpClient from 'utils/httpClient';

export const getListCostType = (params) => {
  return httpClient.get('/cost-type', { params });
};

export const createCostType = (params) => {
  return httpClient.post('/cost-type', params);
};

export const updateCostType = (id, params) => {
  return httpClient.put(`/cost-type/${id}`, params);
};

export const getDetail = (id) => {
  return httpClient.get(`/cost-type/${id}`);
};

export const deleteCostTypes = (params) => {
  let list_id;
  if (Array.isArray(params)) {
    list_id = params.map((costType) => costType.cost_id);
  } else {
    list_id = [params];
  }
  return httpClient.post(`/cost-type/delete`, { list_id });
};

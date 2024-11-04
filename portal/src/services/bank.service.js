import httpClient from 'utils/httpClient.js';

const path = '/bank';

export const getListBank = (params = {}) => {
  return httpClient.get(path, { params });
};
export const getOptionsBanks = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getOptionsBanksByCompany = (params = {}) => {
  return httpClient.get("/bank/get-options-by-company", { params });
}

export const getBankOptions = (params = {}) => {
  return httpClient.get('/bank/get-options', { params });
};

export const getDetailBank = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createBank = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateBank = (params) => {
  return httpClient.put(`${path}`, params);
};

export const deleteBank = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

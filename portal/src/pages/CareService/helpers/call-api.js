import httpClient from 'utils/httpClient';
const prefixGroup = "/care-service";

export const getListCareService = (params) => {
  return httpClient.get('/care-service', { params });
};

export const createCareService = (params = {}) => {
  return httpClient.post('/care-service', params);
};

export const updateCareService = (care_service_code, params) => {
  return httpClient.put(`/care-service/${care_service_code}`, params);
};

export const getCareServiceById = (care_service_code) => {
  return httpClient.get(`/care-service/${care_service_code}`);
};

export const deleteCareService = (list_id) => {
  return httpClient.post(`/care-service/delete`, { data: list_id });
};

export const generateCareCode = (params) => {
  return httpClient.get(prefixGroup + `/generate-care-code`, { params });
}

export const getListOptions = (params) => {
  return httpClient.get('/care-service/get-options', { params });
};

export const getListPeriod = (params) => {
  return httpClient.get('/care-service/get-period', { params });
};

export const getListRepair = (params = {}) => {
  return httpClient.get('/care-service/list-product', { params });
};

export const getListPromotion = (params = {}) => {
  return httpClient.get('/promotion', { params });
};



// const path = '/product';

// export const getListRepair = (params = {}) => httpClient.get(`${path}`, { params });
// export const deleteProduct = (params) => {
//   const ids = (params || []).map((x) => x.product_id);
//   return httpClient.post(`${path}/delete`, { ids });
// };


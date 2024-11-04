import httpClient from 'utils/httpClient';

export const getOptionsDocumentType = (params) => {
  return httpClient.get('/document-type/get-options', { params });
};

export const getList = (params = {}) => {
  return httpClient.get("/document-type", {params});
};

export const getDetail = (id) => {
  return httpClient.get(`/document-type/${id}`);
};

export const create = (params) => {
  return httpClient.post(`/document-type`, params);
};
export const update = (id, params) => {
  return httpClient.put(`/document-type/${id}`, params);
};

export const deleteDocumentType = (id) => {
  return httpClient.delete(`/document-type/${id}`);
};

export const getCompany = (params) => {
  return httpClient.get(`/company/get-options/user`,params);
};

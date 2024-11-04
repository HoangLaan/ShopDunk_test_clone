import httpClient from 'utils/httpClient.js';

const route = '/off-work-management';

export const getList = (params) => {
  return httpClient.get(route, {params});
};

export const getStatistics = (params) => {
  return httpClient.get(route + `/statistics`,params?{params}:null);
};

export const createOrUpdate = (params) => {
  return httpClient.post(route, params);
};

export const getDepartmentByBlock = (params) => {
  return httpClient.get(route+ `/get-department-options`, {params});
};

export const getDetail = (params) => {
  return httpClient.get(route+ `/${params}`);
};

export const handleDelete = (params) => {
  return httpClient.delete(route+ `/${params}`);
};





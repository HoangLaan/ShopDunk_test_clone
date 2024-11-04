import httpClient from 'utils/httpClient';

export const getListPosition = (params = {}) => {
  return httpClient.get('/position', { params });
};
export const getOptionsPosition = (params) => {
  return httpClient.get('/position/get-options', { params });
};

export const getOptionsDepartment = () => {
  const params = {
    itemsPerPage: 999,
    is_active: 1,
  }
  console.log(params)
  return httpClient.get('/department', { params });
};

export const getDetailPosition = (id) => {
  return httpClient.get(`/position/${id}`);
};
export const createPosition = (params) => {
  return httpClient.post(`/position`, params);
};
export const createWorkType = (params) => {
  return httpClient.post(`/work-type`, params);
};

export const updatePosition = (id, params) => {
  return httpClient.put(`/position/${id}`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deletePosition = (list_id) => {
  return httpClient.delete(`/position/`, { data: { list_id } });
};
export const getOptionByDepartmentId = (params) => {
  return httpClient.get('/position/get-option-by-department', { params });
};

export const downloadJdFile = (position_level_id) => {
  const header = {
    responseType: 'blob',
  };
  return httpClient.get(`position/jd-file/download/${position_level_id}`, header);
};

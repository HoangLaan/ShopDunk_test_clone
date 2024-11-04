import api from 'utils/httpClient';

const route = '/user_schedule';

export const getList = (params) => {
  return api.get(route, { params });
};

export const getListUserShift = (params) => {
  return api.get('user/user-shift', { params });
};

export const getCompanyOpts = (params) => {
  return api.get(route + `/company-options`, { params });
};

export const getBusinessOpts = (id, params) => {
  return api.get(route + `/list_optionbusiness/${id}`, { params });
};

export const getStoreOpts = (params) => {
  return api.get(route + `/store-options`, { params });
};

export const getDepartmentList = (params) => {
  return api.get('/department', { params });
};

export const getUserList = (params) => {
  return api.get('/user/user-shift', { params });
};

export const create = (params) => {
  return api.post(route + '/create_user_schedule', params);
};

export const update = (params) => {
  return api.post(route + `/update`, params);
};

export const read = (params) => {
  return api.get(route + `/detail`, { params });
};

export const deleteItem = (params) => {
  return api.post(route + `/delete`, params);
};

export const updateExplanation = (params) => {
  return api.post(route + '/explanation', params);
};

export const updateReview = (params) => {
  return api.post(route + '/update-review', params);
};

export const exportExcel = (params) => {
  const header = {
    responseType: `blob`,
  };
  return api.get(route + '/export', { params, ...header });
};

//APi export phân ca
export const exportExcelSchedule = (params) => {
  const header = {
    responseType: `blob`,
  };
  return api.get(route + '/export-schedule', { params, ...header });
};

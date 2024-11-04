import httpClient from 'utils/httpClient';

const route = '/off-work';

export const getList = (params) => {
  return httpClient.get(route, { params });
};

export const create = (params) => {
  return httpClient.post(route, params);
};

export const update = (id, params) => {
  return httpClient.put(route + `/${id}`, params);
};

export const read = (id, params) => {
  return httpClient.get(route + `/${id}`, params);
};

export const deleteItem = (id, params) => {
  return httpClient.delete(route + `/${id}`, params);
};

export const getOffWorkTypeOpts = (params) => {
  return httpClient.get(`/off-work-type/get-options-for-create`, { params });
};

export const getTotalDayOffWork = (params) => {
  return httpClient.get(route + `/me/total-day-offwork`, { params });
};

export const getListOffWorkRLUser = (params) => {
  return httpClient.get(`/off-work-type/get-list-offwork-rl-user`, { params });
};

export const getUserOfDepartmentOpts = (params) => {
  return httpClient.get(route + `/user-of-deparment-options`, { params });
};

export const approvedOffWorkReviewList = (id, params) => {
  return httpClient.put(route + `/${id}/approved-review-list`, params);
};

export const getUserScheduleOtps = (params) => {
  return httpClient.get(route + `/user-schedule-option`, { params: { ...params } });
};

export const updateConfirm = (params) => {
  return httpClient.put(route + `/confirm`, params);
};

export const exportExcelOffWork = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(route + `/export`, { params, ...header });
};

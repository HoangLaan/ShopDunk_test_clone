import httpClient from 'utils/httpClient.js';

const path = '/task';

export const getTaskList = (params = {}) => {
  return httpClient.get(path, { params });
};

export const getCustomerList = (params = {}) => {
  return httpClient.get(`${path}/customer`, { params });
};

export const getCustomerListByUser = (params = {}) => {
  return httpClient.get(`${path}/customer-by-user`, { params });
};

export const deleteTask = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const getTaskDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const getCareDetail = (task_detail_id) => {
  return httpClient.get(`${path}/care/${task_detail_id}`);
};

export const createTask = (params) => {
  return httpClient.post(`${path}`, params);
};

export const createCareComment = (params) => {
  return httpClient.post(`${path}/care/comment`, params);
};

export const getCareCommentList = (params = {}) => {
  return httpClient.get(`${path}/care/comment`, { params });
};

export const getCareProductList = (params = {}) => {
  return httpClient.get(`${path}/care/product`, { params });
};

export const changeWorkFlow = (params) => {
  return httpClient.post(`${path}/care/change-work-flow`, params);
};

export const getCareHistoryList = (params = {}) => {
  return httpClient.get(`${path}/care/history/${params.task_detail_id}`, { params });
};

export const updateTask = (params) => {
  return httpClient.put(`${path}`, params);
};

export const getTaskOptions = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getTaskTypeOptions = (params) => {
  return httpClient.get(`${path}/task-type/get-options`, { params });
};

export const getUserOptionsByDepartmentStore = (params) => {
  return httpClient.get(`${path}/user/get-options`, { params });
};

export const getStoreOptionsByCompany = (params) => {
  return httpClient.get(`${path}/store/get-options`, { params });
};

export const getDepartmentOptionsByCompany = (params) => {
  return httpClient.get(`${path}/department/get-options`, { params });
};

export const getProductOptions = (params) => {
  return httpClient.get(`${path}/product/get-options`, { params });
};

export const getMemberList = (params = {}) => {
  return httpClient.get(`${path}/member`, { params });
};

export const createSMSCustomer = (params) => {
  return httpClient.post(`${path}/care/sms`, params);
};

export const createCallCustomer = (params) => {
  return httpClient.post(`${path}/care/call`, params);
};

export const createAppointmentCustomer = (params) => {
  return httpClient.post(`${path}/care/meeting`, params);
};

export const getUserOptions = (params) => {
  return httpClient.get(`${path}/user/get-options`, { params });
};

export const getBrandnameOptions = () => {
  return httpClient.get(`${path}/brandname/get-options`);
};

export const getSmsTemplateOptions = (params) => {
  return httpClient.get(`${path}/sms-template/get-options`, { params });
};

export const getTaskTypeAutoOptions = (params) => {
  return httpClient.get(`${path}/task-type-auto/get-options`, { params });
};

export const updateInterestContent = (payload) => {
  return httpClient.post(`${path}/care/interest-content`, payload);
};

import httpClient from 'utils/httpClient.js';
const path = '/task-work-flow';
export const getListTaskWorkflow = (params = {}) => {
  return httpClient.get(path, { params });
};
export const getDetailTaskWorkflow = (id) => {
  return httpClient.get(`${path}/${id}`);
};
export const createTaskWorkflow = (params) => {
  return httpClient.post(path, params);
};
export const updateTaskWorkflow = (id, params) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const deleteTaskWorkflow = (list_id = []) => {
  return httpClient.delete(path, { data: { list_id } });
};

export const getOptionsTaskWorkflow = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const downloadTemplateTaskWorkflow = (_data) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/download-excel`, header);
};

export const importExcelTaskWorkflow = (file) => {
  let formData = new FormData();
  formData.append(`taskWorkFlowimport`, file);
  return httpClient.post(`${path}/import-excel`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const exportExcelTaskWorkflow = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/export-excel`, { params, ...header });
};

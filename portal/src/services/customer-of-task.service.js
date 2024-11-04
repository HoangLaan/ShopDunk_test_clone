import httpClient from 'utils/httpClient';

const path = '/customer-of-task';

export const getList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getById = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const create = (params) => {
  return httpClient.post(`${path}`, params);
};

export const update = (params) => {
  return httpClient.put(`${path}`, params);
};


// get option
export const getOptionsSource = (params) => {
  return httpClient.get(`${path}/source/get-options`, { params });
}
// get option
export const getOptionsStore = (params) => {
  return httpClient.get(`${path}/store/get-options`, { params });
}
// get option
export const getOptionsCustomerType = (params) => {
  return httpClient.get(`${path}/customer-type/get-options`, { params });
}
// get option
export const getOptionsTaskType = (params) => {
  return httpClient.get(`${path}/task-type/get-options`, { params });
}
// get option
export const getOptionsTaskWorkFlow = (params) => {
  return httpClient.get(`${path}/task-work-flow/get-options`, { params });
}

// get option
export const getOptionsTask = (params) => {
  return httpClient.get(`${path}/task/get-options`, { params });
}
// get option
export const getConfig = (params) => {
  return httpClient.get(`${path}/get-config`, { params });
}

export const getTaskWorkFlow = (params) => {
  return httpClient.get(`${path}/task-work-flow`, { params });
}


// danh sách khách hàng
export const getListCustomer = (params = {}) => {
  return httpClient.get('/order/customer-list', { params });
};
// danh sách sản phẩm
export const getProductOptions = (params) => {
  return httpClient.get(`/task/product/get-options`, { params });
};

export const changeWorkFlow = (params) => {
  return httpClient.post(`task/care/change-work-flow`, params);
};

export const exportExcelCustomerInfo = (payload) => {
  return httpClient.post(`${path}/export-excel`, payload, { responseType: 'blob' });
};
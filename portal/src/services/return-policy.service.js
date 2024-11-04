import httpClient from 'utils/httpClient.js';

const path = '/return-policy';

export const getReturnPolicyList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getReturnPolicyDetail = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const createReturnPolicy = (params) => {
  return httpClient.post(`${path}`, params);
};

export const updateReturnPolicy = (params) => {
  return httpClient.put(`${path}`, params);
};

// done
export const deleteReturnPolicy = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

// done
export const getListReturnCondition = (params = {}) => {
  return httpClient.get(`${path}/condition`, { params });
};

// done
export const getCustomerTypeOptions = (params = {}) => {
  return httpClient.get(`${path}/customer-type-options`, { params });
};

// done
export const getListProductCategory = (params = {}) => {
  return httpClient.get(`${path}/product-category`, { params });
};

// done
export const getListProduct = (params = {}) => {
  return httpClient.get(`${path}/product`, { params });
};

export const getCategoryOptions = (params = {}) => {
  return httpClient.get(`${path}/category-options`, { params });
};

export const getProductOptions = (params = {}) => {
  return httpClient.get(`${path}/product-options`, { params });
};

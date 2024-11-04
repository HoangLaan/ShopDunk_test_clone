import httpClient from 'utils/httpClient';

const path = '/internal-transfer';

export const getInternalTransferOptions = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getOptionsInternalTransfer = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};
export const getOptionsBusiness = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getDetailInternalTransfer = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const deleteInternalTransfer = (list_id) => {
  return httpClient.delete(`${path}`, { params: { list_id } });
};

export const getListUser = (params) => {
  return httpClient.get(`${path}/users`, { params });
};

export const getPositionByDepartmentId = (params) => {
  return httpClient.get(`/position/get-option-by-department`, { params });
};

export const getDepartmentOptions = (params) => {
  return httpClient.get(`/department/get-options`, { params });
};

export const createOrUpdateReviewLevel = (params) => {
  return httpClient.post(`${path}/review-level`, params);
};

export const getListReviewLevel = (params) => {
  return httpClient.get(`${path}/review-level`, { params });
};

export const deleteReviewLevel = (list_id) => {
  return httpClient.delete(`${path}/review-level`, { params: { list_id } });
};

// done
export const genCode = () => {
  return httpClient.get(`${path}/gen-code`);
};

// done
export const getStoreOptions = () => {
  return httpClient.get(`${path}/store-options`);
};

// done
export const getBankAccountOptions = (params = {}) => {
  return httpClient.get(`${path}/bank-account-options`, { params });
};

// done
export const getInternalTransferTypeOptions = (params = {}) => {
  return httpClient.get(`${path}/internal-transfer-type-options`, { params });
};

// done
export const getReviewLevelListInternalTransferType = (params = {}) => {
  return httpClient.get(`${path}/internal-transfer-type/review-level`, { params });
};

// done
export const createInternalTransfer = (params = {}) => {
  return httpClient.post(`${path}`, params);
};

//done
export const updateInternalTransfer = (params = {}) => {
  return httpClient.put(`${path}`, params);
};

//done
export const updateReviewLevel = (params = {}) => {
  return httpClient.put(`${path}/review-level`, params);
};

export const getListCountReviewStatus = (params) => {
  return httpClient.get(`${path}/review-status/count`, { params });
};

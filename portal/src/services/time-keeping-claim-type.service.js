import httpClient from 'utils/httpClient';

const path = '/time-keeping-claim-type';

export const getTimeKeepingClaimTypeOptions = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
}

export const getOptionsTimeKeepingClaimType = (params = {}) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};
export const getOptionsBusiness = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getDetailTimeKeepingClaimType = (id) => {
  return httpClient.get(`${path}/${id}`);
};

// done
export const createTimeKeepingClaimType = (params) => {
  return httpClient.post(`${path}`, params);
};

// done
export const updateTimeKeepingClaimType = (params) => {
  return httpClient.put(`${path}`, params);
};

// done
export const deleteTimeKeepingClaimType = (list_id) => {
  return httpClient.delete(`${path}`, {params: {list_id}});
};

// done
export const getListUser = (params) => {
  return httpClient.get(`${path}/users`, { params });
}

// done
export const getPositionByDepartmentId = (params) => {
  return httpClient.get(`/position/get-option-by-department`, { params });
}

// done
export const getDepartmentOptions = (params) => {
  return httpClient.get(`/department/get-options`, { params });
}

// done
export const createOrUpdateReviewLevel = (params) => {
  return httpClient.post(`${path}/review-level`, params);
};

// done
export const getListReviewLevel = (params) => {
  return httpClient.get(`${path}/review-level`, {params});
};

// done
export const deleteReviewLevel = (list_id) => {
  return httpClient.delete(`${path}/review-level`, {params: {list_id}});
};

// done
export const getUserOptions = (params) => {
  return httpClient.get(`${path}/user-options`, {params});
};
export const getUserReviewByTypeId = (params) => {
  return httpClient.get(`${path}/getusersbytypeclaimid`, {params});
};


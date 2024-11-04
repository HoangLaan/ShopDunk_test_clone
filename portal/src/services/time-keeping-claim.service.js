import httpClient from 'utils/httpClient';

const path = '/time-keeping-claim';

export const getList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};
export const getOptionsBusiness = (params) => {
  return httpClient.get(`${path}/get-options`, { params });
};

export const getDetailTimeKeepingClaim = (id) => {
  return httpClient.get(`${path}/${id}`);
};

// done
export const createTimeKeepingClaim = (params) => {
  return httpClient.post(`${path}`, params);
};

// done
export const updateTimeKeepingClaim = (params) => {
  return httpClient.put(`${path}`, params);
};

// done
export const deleteTimeKeepingClaim = (list_id) => {
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


export const updateReview = (params) => {
  return httpClient.put(`${path}/reviewed`, params);
};

export const getDetailTimeKeepingClaimByScheduleId = (id, params) => {
  return httpClient.get(`${path}/schedule/${id}`, {params});
};

export const countTimesExplained = (params) => {
  return httpClient.get(`${path}/count-explain`, {params});
};

export const ExportExcelTimeKeepingClaim = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/export-excel`, {params, ...header});
};

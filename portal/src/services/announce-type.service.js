import api from 'utils/httpClient';

const path = '/announce-type';

export const getListAnnounceType = (params = {}) => {
  return api.get(`${path}`, { params });
};

export const getDetailAnnounceType = (id) => {
  return api.get(`${path}/${id}`);
};
export const createAnnounceType = (params) => {
  return api.post(`${path}`, params);
};
export const updateAnnounceType = (id, params) => {
  return api.put(`${path}/${id}`, params);
};

export const deleteAnnounceType = (list_id = []) => {
  return api.delete(`${path}`, { data: { list_id } });
};

export const getUserOptions = (params) => {
  return api.get(`${path}/get-user-options`, { params });
};

// export const getReviewLevelOptions = (params) => {
//   return api.get(`${path}/get-review-level-options`, { params });
// };

export const getCompanyOptions = (params) => {
  return api.get(`${path}/get-company-options`, { params });
};

export const getDepartmentOptions = (params) => {
  return api.get(`${path}/get-department-options`, { params });
};

export const getReviewLevelList = (params) => {
  return api.get(`${path}/review-level`, { params });
};

export const createReviewLevel = (params) => {
  return api.post(`${path}/review-level`, params);
};

export const deleteReviewLevel = (list_id = []) => {
  return api.delete(`${path}/review-level`, { data: { list_id } });
};

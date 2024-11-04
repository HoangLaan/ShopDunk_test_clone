import httpClient from 'utils/httpClient.js';

export const getOptionsUserGroup = (params = {}) => {
  return httpClient.get('/usergroup/get-options', {
    is_active: 1,
  });
};

export const getOptionsUserGroupFunction = (params) => {
  return httpClient.get('/usergroup-function/get-list-function-groups', { params });
};

export const getOptionsUserGroupFunctionDetail = (id) => {
  return httpClient.get(`/usergroup-function/get-list-functions-by-function-group/${id}`, {
    itemsPerPage: 2147483647,
  });
};

export const createPermission = (data) => {
  return httpClient.post('/usergroup-function', data);
};

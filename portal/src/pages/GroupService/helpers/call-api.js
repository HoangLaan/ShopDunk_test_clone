import httpClient from 'utils/httpClient';
const prefixGroup = "/group-care-service";

export const getListGroupService = (params) => {
  return httpClient.get(prefixGroup, { params });
};

export const createGroupService = (params = {}) => {
  return httpClient.post(prefixGroup, params);
};

export const updateGroupService = (group_service_code, params) => {
  return httpClient.put(prefixGroup + `/${group_service_code}`, params);
};

export const getGroupServiceById = (group_service_code) => {
  return httpClient.get(prefixGroup + `/${group_service_code}`);
};

export const deleteGroupService = (list_id) => {
  return httpClient.post(prefixGroup + "/delete", { data: list_id });
};

export const generateGroupCode = (params) => {
  return httpClient.get(prefixGroup + `/generate-group-code`, { params });
}

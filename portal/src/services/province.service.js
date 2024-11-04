import api from "utils/httpClient";

export const getList = (_data = {}) => {
  return api.get("/province", _data);
};
export const getOptionsProvince = (_data = {}) => {
  return api.get("/province/get-options", _data);
};


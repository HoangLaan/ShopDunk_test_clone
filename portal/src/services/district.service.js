import api from "utils/httpClient";

export const getList = (_data = {}) => {
  return api.get("/district", _data);
};
export const getOptionsDistrict = (params = {}) => {
  return api.get("/district/get-options", {params});
};


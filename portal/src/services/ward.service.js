import api from "utils/httpClient";

export const getList = (_data = {}) => {
  return api.get("/ward", _data);
};
export const getOptionsWard = (params = {}) => {
  return api.get("/ward/get-options", {params});
};


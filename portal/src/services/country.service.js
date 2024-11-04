import api from "utils/httpClient";

export const getList = (_data = {}) => {
  return api.get("/country", _data);
};
export const getOptionsCountry = (_data = {}) => {
  return api.get("/country/get-options", _data);
};


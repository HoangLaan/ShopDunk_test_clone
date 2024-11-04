import httpClient from "utils/httpClient";

export const getList = (_data = {}) => {
  return httpClient.get("/company-type", _data);
};
export const getOptionsCompanyType = (_data = {}) => {
  return httpClient.get("/company-type/get-options", _data);
};


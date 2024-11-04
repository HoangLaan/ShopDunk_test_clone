import httpClient from "utils/httpClient";

export const getOptionsStocksCostType = (params) => {
  return httpClient.get('/cost-type/get-options', { params });
};
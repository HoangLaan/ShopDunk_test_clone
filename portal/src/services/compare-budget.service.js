import httpClient from 'utils/httpClient';

const route = '/compare-budget';

export const getList = (params = {}) => {
  return httpClient.get(route, { params });
};

export const getBudgetPlanOptions = (params = {}) => {
  return httpClient.get(route + '/budget-plan-opts', { params });
};

export const exportExcel = (params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(route + '/export-excel', { params, ...header });
};

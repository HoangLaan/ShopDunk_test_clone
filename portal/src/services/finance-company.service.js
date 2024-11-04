import httpClient from 'utils/httpClient.js';

const path = 'finance-company';

const financeCompanyService = {
  getList: (params = {}) => {
    return httpClient.get(path, { params });
  },
};

export default financeCompanyService;

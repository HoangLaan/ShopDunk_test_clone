import httpClient from 'utils/httpClient.js';

const path = 'trade-in-program';

const tradeInProgramService = {
  getList: (params = {}) => {
    return httpClient.get(path, { params });
  },
};

export default tradeInProgramService;

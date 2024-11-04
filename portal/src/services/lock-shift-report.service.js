import httpClient from 'utils/httpClient.js';

const path = '/lock-shift-report';

export const getLockShiftReportList = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

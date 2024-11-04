import httpClient from 'utils/httpClient';

const path = '/customer-subscriber-report'

const getList = (params) => {
  return httpClient.get(path, { params });
};

export const exportExcel = (params) => {
  return httpClient.post(`${path}/export-excel`, params, {responseType: `blob`});
};

const customerSubscriberReportService = {
  getList, exportExcel
};

export default customerSubscriberReportService;

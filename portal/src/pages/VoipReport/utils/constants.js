export const TYPE_REPORT = [
  {
    label: 'Báo Cáo Dựa Trên Người Dùng', //Report Based On Users - /v3/report/call/user
    value: '/v3/report/call/user',
  },
  {
    label: 'Báo Cáo Tổng Hợp Máy Nhánh', // Report Extension Summary - /v3/report/call/extension
    value: '/v3/report/call/extension',
  },
  {
    label: 'Báo Cáo Tổng Hợp Theo Máy Nhánh Và Người dùng', // Report Summary By Extension and User - v3/report/call/extension/summary
    value: '/v3/report/call/extension/summary',
  },
  {
    label: 'Báo Cáo Tổng Hợp Máy Nhánh Theo Ngày', // Report Extension Summary With Day - v3/report/call/extension/summary/day
    value: '/v3/report/call/extension/summary/day',
  },
  {
    label: 'Báo Cáo Chi tiết Agent', // Get Report Agent Detail - /v3/report/call/agent/detail
    value: '/v3/report/call/agent/detail',
  },
  {
    label: 'Báo Cáo Thời Gian Người Dùng', // Report Agent Time - /v3/report/call/agent/time
    value: '/v3/report/call/agent/time',
  },
  {
    label: 'Báo Cáo Quay Số Tự Động', // Get Report Autodialer - /v3/report/campaign-type/autodialer
    value: '/v3/report/campaign-type/autodialer',
  },
  {
    label: 'Báo Cáo Hiệu Suất Của Agent Với Khách Hàng', // Get Report Agent Performance with Customer - /v3/report/call/agent/performance-with-customer
    value: '/v3/report/call/agent/performance-with-customer',
  },
  {
    label: 'Báo Cáo Theo Dõi Thời Gian Của Agent', // Get Report Tracking Time Agent - /v3/report/call/tracking-time/agent
    value: '/v3/report/call/tracking-time/agent',
  },
];

export const DEFAULT_VALUE = {
  type_report: '/v3/report/call/user',
  start_date: null,
  end_date: null,
};

export const DEFAULT_PARAMS = {
  is_active: 1,
  page: 1,
  itemsPerPage: 25,
  start_date: null,
  end_date: null,
  type_report: '/v3/report/call/user',
};



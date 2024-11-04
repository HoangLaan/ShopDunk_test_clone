import React from 'react';
import { CUSTOMER_SUBSCRIBER_REPORT_PERMISSION } from 'pages/CustomerSubscriberReport/utils/constants';

const CustomerSubscriberReport = React.lazy(() => import('pages/CustomerSubscriberReport/pages/CustomerSubscriberReport'));

const customerSubscriberReportRoute = [
  {
    path: '/customer-subscriber-report',
    exact: true,
    name: 'Danh sách khách hàng nhận tin',
    function: CUSTOMER_SUBSCRIBER_REPORT_PERMISSION.VIEW,
    component: CustomerSubscriberReport,
  },
];

export default customerSubscriberReportRoute;

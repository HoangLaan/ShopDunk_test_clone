import React from 'react';

const ReportHisBuyIP = React.lazy(() => import('pages/PreOrder/Report/ReportHisBuyIPPage'));
const ReportHisBuyIP15Page = React.lazy(() => import('pages/PreOrder/Report/ReportHisBuyIP15Page'));
const InterestCustomerPage = React.lazy(() => import('pages/PreOrder/InterestCustomer/InterestCustomerPage'));

const preOrders = [
  {
    path: '/pre-order/report-buy-ip',
    exact: true,
    name: 'Báo cáo khách hàng mua Iphone',
    function: 'RP_CUSTOMERHISTORYBUYIP_VIEW',
    component: ReportHisBuyIP,
  },
  {
    path: '/pre-order/report-buy-ip-15',
    exact: true,
    name: 'Báo cáo khách hàng mua Iphone 15',
    function: 'RP_CUSTOMERHISTORYBUYIP15_VIEW',
    component: ReportHisBuyIP15Page,
  },
  {
    path: '/pre-order/interest',
    exact: true,
    name: 'Danh sách khách hàng quan tâm chương trình',
    function: 'PO_INTERESTCUSTOMER_VIEW',
    component: InterestCustomerPage,
  },
];

export default preOrders;

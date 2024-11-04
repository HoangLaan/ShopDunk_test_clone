import React from 'react';

const ReportSale = React.lazy(() => import('pages/Report/pages/PageReportSale'));
const ReportFullSale = React.lazy(() => import('pages/Report/pages/PageReportFull'));

const reportRoute = [
  {
    path: '/SalesBookDetail-Sales',
    exact: true,
    name: 'Báo cáo sổ chi tiết bán hàng',
    function: 'RP_SALESDETAILBOOK_VIEW',
    component: ReportSale,
  },
  {
    path: '/SalesBookDetail-Accounting',
    exact: true,
    name: 'Báo cáo sổ chi tiết bán hàng',
    function: 'RP_SALESDETAILBOOK_VIEW',
    component: ReportFullSale,
  },
];

export default reportRoute;

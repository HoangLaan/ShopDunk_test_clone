import React from 'react';

const LockShiftReportPage = React.lazy(() => import('pages/LockShiftReport/LockShiftReportPage'));

const lockShiftReportRoutes = [
  {
    path: '/lock-shift-report',
    exact: true,
    name: 'Báo cáo chốt ca',
    function: 'MD_LOCKSHIFT_VIEWREPORT',
    component: LockShiftReportPage,
  },
];

export default lockShiftReportRoutes;

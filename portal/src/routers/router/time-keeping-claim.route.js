import React from 'react';

const TimeKeepingClaimPage = React.lazy(() => import('pages/TimeKeepingClaim/TimeKeepingClaimPage'));
const TimeKeepingClaimAddPage = React.lazy(() => import('pages/TimeKeepingClaim/TimeKeepingClaimAddPage'));
const path = '/time-keeping-claim';
const routers = [
  {
    path: `${path}`,
    exact: true,
    name: 'Danh sách giải trình',
    function: 'HR_TIMEKEEPINGCLAIMTYPE_VIEW',
    component: TimeKeepingClaimPage,
  },
  {
    path: `${path}/add`,
    exact: true,
    name: 'Thêm mới giải trình',
    function: 'HR_TIMEKEEPINGCLAIMTYPE_ADD',
    component: TimeKeepingClaimAddPage,
  },
  {
    path: `${path}/detail/:id`,
    exact: true,
    name: 'Chi tiết giải trình',
    function: 'HR_TIMEKEEPINGCLAIMTYPE_VIEW',
    component: TimeKeepingClaimAddPage,
  },
  {
    path: `${path}/edit/:id`,
    exact: true,
    name: 'Chỉnh sửa giải trình',
    function: 'HR_TIMEKEEPINGCLAIMTYPE_EDIT',
    component: TimeKeepingClaimAddPage,
  },
];

export default routers;

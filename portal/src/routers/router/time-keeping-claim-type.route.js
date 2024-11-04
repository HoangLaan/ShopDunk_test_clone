import React from 'react';

const TimeKeepingClaimTypePage = React.lazy(() => import('pages/TimeKeepingClaimType/TimeKeepingClaimTypePage'));
const TimeKeepingClaimTypeAddPage = React.lazy(() => import('pages/TimeKeepingClaimType/TimeKeepingClaimTypeAddPage'));
const path = '/time-keeping-claim-type';
const routers = [
  {
    path: `${path}`,
    exact: true,
    name: 'Danh sách loại giải trình',
    function: 'HR_TIMEKEEPINGCLAIMTYPE_VIEW',
    component: TimeKeepingClaimTypePage,
  },
  {
    path: `${path}/add`,
    exact: true,
    name: 'Thêm mới loại giải trình',
    function: 'HR_TIMEKEEPINGCLAIMTYPE_ADD',
    component: TimeKeepingClaimTypeAddPage,
  },
  {
    path: `${path}/detail/:id`,
    exact: true,
    name: 'Chi tiết loại giải trình',
    function: 'HR_TIMEKEEPINGCLAIMTYPE_VIEW',
    component: TimeKeepingClaimTypeAddPage,
  },
  {
    path: `${path}/edit/:id`,
    exact: true,
    name: 'Chỉnh sửa loại giải trình',
    function: 'HR_TIMEKEEPINGCLAIMTYPE_EDIT',
    component: TimeKeepingClaimTypeAddPage,
  },
];

export default routers;

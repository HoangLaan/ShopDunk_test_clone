import React from 'react';

const OffWork = React.lazy(() => import('pages/Offwork/pages/OffWorkPage'));
const OffWorkEdit = React.lazy(() => import('pages/Offwork/pages/OffWorkEdit'));
const OffWorkDetail = React.lazy(() => import('pages/Offwork/pages/OffWorkDetail'));
const OffWorkReview = React.lazy(() => import('pages/Offwork/pages/OffWorkReview'));
const OffWorkAdd = React.lazy(() => import('pages/Offwork/pages/OffWorkAdd'));

const OffWorkRoutes = [
  {
    path: '/off-work',
    exact: true,
    name: 'Danh sách nghỉ phép',
    function: 'HR_OFFWORK_VIEW',
    component: OffWork,
  },
  {
    path: '/off-work/edit/:id',
    exact: true,
    name: 'Chỉnh sửa nghỉ phép',
    function: 'HR_OFFWORK_EDIT',
    component: OffWorkEdit,
  },
  {
    path: '/off-work-add',
    exact: true,
    name: 'Đăng kí nghỉ phép',
    function: 'HR_OFFWORK_ADD',
    component: OffWorkAdd,
  },
  {
    path: '/off-work/detail/:id',
    exact: true,
    name: 'Chi tiết nghỉ phép',
    function: 'HR_OFFWORK_VIEW',
    component: OffWorkDetail,
  },
  {
    path: '/off-work/review/:id',
    exact: true,
    name: 'Duyệt nghỉ phép',
    function: 'HR_OFFWORK_REVIEW',
    component: OffWorkReview,
  },
];

export default OffWorkRoutes;

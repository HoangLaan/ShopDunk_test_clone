import React from 'react';

const TransferShiftAddPage = React.lazy(() => import('pages/TransferShift/TransferShiftAddPage'));
const ClusterPage = React.lazy(() => import('pages/TransferShift/TransferShiftPage'));

const transferShift = [
  {
    path: '/transfer-shift',
    exact: true,
    name: 'Danh sách chuyển ca',
    function: 'HR_TRANSFERSHIFT_VIEW',
    component: ClusterPage,
  },
  {
    path: '/transfer-shift/add',
    exact: true,
    name: 'Thêm mới chuyển ca',
    function: 'HR_TRANSFERSHIFT_ADD',
    component: TransferShiftAddPage,
  },
  {
    path: '/transfer-shift/edit/:transfer_shift_id',
    exact: true,
    name: 'Chi tiết chuyển ca',
    function: 'HR_TRANSFERSHIFT_EDIT',
    component: TransferShiftAddPage,
  },
  {
    path: '/transfer-shift/detail/:transfer_shift_id',
    exact: true,
    name: 'Chi tiết chuyển ca',
    function: 'HR_TRANSFERSHIFT_VIEW',
    component: TransferShiftAddPage,
  },
];

export default transferShift;

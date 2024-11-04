import React from 'react';

const TransferShiftTypeAddPage = React.lazy(() => import('pages/TransferShiftType/TransferShiftTypeAddPage'));
const TransferShiftTypePage = React.lazy(() => import('pages/TransferShiftType/TransferShiftTypePage'));

const prefix = '/transfer-shift-type';
const TransferShiftType = [
  {
    path: prefix,
    exact: true,
    name: 'Danh sách loại yêu cầu chuyển ca',
    function: 'HR_TRANSFERSHIFT_TYPE_VIEW',
    component: TransferShiftTypePage,
  },
  {
    path: `${prefix}/add`,
    exact: true,
    name: 'Thêm mới loại yêu cầu chuyển ca',
    function: 'HR_TRANSFERSHIFT_TYPE_ADD',
    component: TransferShiftTypeAddPage,
  },
  {
    path: `${prefix}/edit/:id`,
    exact: true,
    name: 'Chỉnh sửa loại yêu cầu chuyển ca',
    function: 'HR_TRANSFERSHIFT_TYPE_EDIT',
    component: TransferShiftTypeAddPage,
  },
  {
    path: `${prefix}/detail/:id`,
    exact: true,
    name: 'Chi tiết loại yêu cầu chuyển ca',
    function: 'HR_TRANSFERSHIFT_TYPE_VIEW',
    component: TransferShiftTypeAddPage,
  },
];

export default TransferShiftType;

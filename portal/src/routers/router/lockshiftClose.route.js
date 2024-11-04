import React from 'react';

const LockShiftClose = React.lazy(() => import('pages/LockshiftClose/pages/DefaultPage'));
const LockShiftDetail = React.lazy(() => import('pages/LockshiftClose/pages/DetailPage'));
const LockshiftEdit = React.lazy(() => import('pages/LockshiftClose/pages/EditPage'));
const LockshiftAdd = React.lazy(() => import('pages/LockshiftClose/pages/AddPage'));

const lockshiftClose = [
  {
    path: '/lockshift-close/add',
    exact: true,
    name: 'Tạo kết ca',
    function: 'MD_LOCKSHIFT_ADD',
    component: LockshiftAdd,
  },
  {
    path: '/lockshift-close',
    exact: true,
    name: 'Danh sách kết ca',
    function: 'MD_LOCKSHIFT_VIEW',
    component: LockShiftClose,
  },
  {
    path: '/lockshift-close/detail/:id',
    exact: true,
    name: 'Chi tiết kết ca',
    function: 'MD_LOCKSHIFT_VIEW',
    component: LockShiftDetail,
  },
  {
    path: '/lockshift-close/edit/:id',
    exact: true,
    name: 'Chỉnh sửa kết ca',
    function: 'MD_LOCKSHIFT_EDIT',
    component: LockshiftEdit,
  },
];

export default lockshiftClose;

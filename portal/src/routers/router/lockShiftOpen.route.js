import React from 'react';

const LockShiftOpen = React.lazy(() => import('pages/LockShiftOpen/pages/DefaultPage'));
const LockShiftAdd = React.lazy(() => import('pages/LockShiftOpen/pages/AddPage'));
const LockShiftDetail = React.lazy(() => import('pages/LockShiftOpen/pages/DetailPage'));
const LockShiftEdit = React.lazy(() => import('pages/LockShiftOpen/pages/EditPage'));

const lockshiftOpen = [
  {
    path: '/lockshift-open',
    exact: true,
    name: 'Danh sách nhận ca',
    function: 'MD_LOCKSHIFT_VIEW',
    component: LockShiftOpen,
  },
  {
    path: '/lockshift-open/add',
    exact: true,
    name: 'Thêm mới nhận ca',
    function: 'MD_LOCKSHIFT_ADD',
    component: LockShiftAdd,
  },
  {
    path: '/lockshift-open/edit/:id',
    exact: true,
    name: 'Chỉnh sửa nhận ca',
    function: 'MD_LOCKSHIFT_EDIT',
    component: LockShiftEdit,
  },
  {
    path: '/lockshift-open/detail/:id',
    exact: true,
    name: 'Chi tiết nhận ca',
    function: 'MD_LOCKSHIFT_EDIT',
    component: LockShiftDetail,
  },
];

export default lockshiftOpen;

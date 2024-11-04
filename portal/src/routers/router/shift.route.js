import React from 'react';

// Shift

const Shift = React.lazy(() => import('pages/Shift/pages/ShiftPage'));
const ShiftAdd = React.lazy(() => import('pages/Shift/pages/ShiftAdd'));
const ShiftEdit = React.lazy(() => import('pages/Shift/pages/ShiftEdit'));
const ShiftDetail = React.lazy(() => import('pages/Shift/pages/ShiftDetail'));

//.end Shift

const shift = [
  // Shift
  {
    path: '/shift',
    exact: true,
    name: 'Danh sách ca làm việc',
    function: 'MD_SHIFT_VIEW',
    component: Shift,
  },
  {
    path: '/shift/add',
    exact: true,
    name: 'Thêm mới ca làm việc',
    function: 'MD_SHIFT_ADD',
    component: ShiftAdd,
  },
  {
    path: '/shift/detail/:id',
    exact: true,
    name: 'Chi tiết ca làm việc',
    function: 'MD_SHIFT_VIEW',
    component: ShiftDetail,
  },
  {
    path: '/shift/delete/:id',
    exact: true,
    name: 'Xóa',
    function: 'MD_SHIFT_DEL',
  },
  {
    path: '/shift/edit/:id',
    exact: true,
    name: 'Chỉnh sửa ca làm việc',
    function: 'MD_SHIFT_EDIT',
    component: ShiftEdit,
  },
  //.end Shift
];

export default shift;

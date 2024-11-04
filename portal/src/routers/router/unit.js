import React from 'react';

const UnitPage = React.lazy(() => import('pages/Unit/UnitPage'));
const UnitAddPage = React.lazy(() => import('pages/Unit/UnitAddPage'));

const unit = [
  {
    path: '/unit',
    exact: true,
    name: 'Danh sách đơn vị tính',
    function: 'MD_UNIT_VIEW',
    component: UnitPage,
  },
  {
    path: '/unit/add',
    exact: true,
    name: 'Thêm mới đơn vị tính',
    function: 'MD_UNIT_ADD',
    component: UnitAddPage,
  },
  {
    path: '/unit/detail/:id',
    exact: true,
    name: 'Chi tiết đơn vị tính',
    function: 'MD_UNIT_VIEW',
    component: UnitAddPage,
  },
  {
    path: '/unit/edit/:id',
    exact: true,
    name: 'Chỉnh sửa đơn vị tính',
    function: 'MD_UNIT_EDIT',
    component: UnitAddPage,
  },
];

export default unit;
